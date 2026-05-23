"""CMS Pages API tests — /api/pages CRUD, auth, default seeded content, upsert."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/") or "https://precision-abrasives.preview.emergentagent.com"
ADMIN_EMAIL = "admin@mayur.com"
ADMIN_PASSWORD = "MayurAdmin@2024"


@pytest.fixture(scope="module")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json().get("access_token")


@pytest.fixture(scope="module")
def admin(api, admin_token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {admin_token}"})
    return s


# --- GET /api/pages lists all 7 default pages
def test_list_pages_has_7_defaults(api):
    r = api.get(f"{BASE_URL}/api/pages")
    assert r.status_code == 200
    pages = r.json()
    keys = {p["key"] for p in pages}
    expected = {"home", "about", "contact", "privacy", "terms", "dealer", "footer"}
    assert expected.issubset(keys), f"missing: {expected - keys}"
    for p in pages:
        assert "sections" in p
        assert "seo" in p
        assert "meta" in p
        assert "enabled" in p


# --- Home has 7 sections in correct order
def test_get_home_has_7_sections(api):
    r = api.get(f"{BASE_URL}/api/pages/home")
    assert r.status_code == 200
    data = r.json()
    section_keys = [s["key"] for s in data["sections"]]
    assert section_keys == ["hero", "about", "new_products", "featured_products", "categories", "testimonials", "cta"]
    about = next(s for s in data["sections"] if s["key"] == "about")
    assert about["heading"] == "Industrial Strength, Trusted Quality"


# --- Footer page has meta with social, quick_links, copyright_text, company_description
def test_get_footer_meta(api):
    r = api.get(f"{BASE_URL}/api/pages/footer")
    assert r.status_code == 200
    data = r.json()
    meta = data["meta"]
    assert "company_description" in meta
    assert "quick_links" in meta and isinstance(meta["quick_links"], list)
    assert "social" in meta
    social = meta["social"]
    for k in ["facebook", "instagram", "linkedin", "youtube", "twitter", "whatsapp"]:
        assert k in social, f"missing social key {k}"
    assert "copyright_text" in meta


# --- PUT requires admin
def test_put_pages_requires_auth(api):
    r = api.put(f"{BASE_URL}/api/pages/home", json={"enabled": True})
    assert r.status_code in (401, 403), f"expected 401/403 got {r.status_code}"


# --- PUT home updates sections and persists
def test_put_home_updates_sections(admin, api):
    # Get current home
    r0 = api.get(f"{BASE_URL}/api/pages/home")
    original = r0.json()
    original_sections = original["sections"]

    # Modify about section heading
    new_sections = [dict(s) for s in original_sections]
    for s in new_sections:
        if s["key"] == "about":
            s["heading"] = "TEST_About_Heading_CMS"

    r = admin.put(f"{BASE_URL}/api/pages/home", json={"sections": new_sections, "enabled": True})
    assert r.status_code == 200, f"PUT failed: {r.status_code} {r.text}"

    # GET to verify
    r2 = api.get(f"{BASE_URL}/api/pages/home")
    assert r2.status_code == 200
    sections = r2.json()["sections"]
    about = next(s for s in sections if s["key"] == "about")
    assert about["heading"] == "TEST_About_Heading_CMS"

    # Cleanup: restore original
    admin.put(f"{BASE_URL}/api/pages/home", json={"sections": original_sections})


# --- PUT footer with meta payload persists
def test_put_footer_meta_persists(admin, api):
    r0 = api.get(f"{BASE_URL}/api/pages/footer")
    original_meta = r0.json()["meta"]

    new_meta = dict(original_meta)
    new_meta["company_description"] = "TEST_company_desc"
    new_meta["copyright_text"] = "TEST_copyright_2026"
    new_meta["social"] = dict(original_meta.get("social", {}))
    new_meta["social"]["facebook"] = "https://facebook.com/TEST_mayur"
    new_meta["quick_links"] = [{"label": "TEST_Link", "href": "/test"}]

    r = admin.put(f"{BASE_URL}/api/pages/footer", json={"meta": new_meta})
    assert r.status_code == 200, f"PUT failed: {r.status_code} {r.text}"

    r2 = api.get(f"{BASE_URL}/api/pages/footer")
    m = r2.json()["meta"]
    assert m["company_description"] == "TEST_company_desc"
    assert m["copyright_text"] == "TEST_copyright_2026"
    assert m["social"]["facebook"] == "https://facebook.com/TEST_mayur"
    assert any(ql["label"] == "TEST_Link" for ql in m["quick_links"])

    # Cleanup
    admin.put(f"{BASE_URL}/api/pages/footer", json={"meta": original_meta})


# --- PUT to non-existent page creates via upsert
def test_put_nonexistent_page_upserts(admin, api):
    key = "test_cms_upsert_xyz"
    # ensure not present
    api.get(f"{BASE_URL}/api/pages/{key}")  # may 404

    r = admin.put(f"{BASE_URL}/api/pages/{key}", json={
        "title": "TEST Upsert Page",
        "enabled": True,
        "content_html": "<p>hello</p>",
        "seo": {"meta_title": "T", "meta_description": "D", "keywords": "k", "og_image": ""}
    })
    assert r.status_code == 200, f"upsert PUT failed: {r.status_code} {r.text}"

    r2 = api.get(f"{BASE_URL}/api/pages/{key}")
    assert r2.status_code == 200
    data = r2.json()
    assert data["title"] == "TEST Upsert Page"
    assert data["content_html"] == "<p>hello</p>"
    assert data["seo"]["meta_title"] == "T"

    # Cleanup: delete the test page from mongo via direct call not available — skip; or PUT enabled=False
    # No delete endpoint. Acceptable since key is TEST_ prefixed.


# --- PUT privacy content_html persists
def test_put_privacy_content_html(admin, api):
    r0 = api.get(f"{BASE_URL}/api/pages/privacy")
    original = r0.json()["content_html"]

    new_html = "<h2>TEST Privacy</h2><p>updated body</p>"
    r = admin.put(f"{BASE_URL}/api/pages/privacy", json={"content_html": new_html})
    assert r.status_code == 200

    r2 = api.get(f"{BASE_URL}/api/pages/privacy")
    assert r2.json()["content_html"] == new_html

    admin.put(f"{BASE_URL}/api/pages/privacy", json={"content_html": original})
