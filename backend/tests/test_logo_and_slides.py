"""Backend tests for iter6: logo_url field on /api/settings and empty-slide filter regression."""
import os
import pytest
import requests

BASE_URL = ""
try:
    with open("/app/frontend/.env") as fh:
        for line in fh:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break
except Exception:
    pass
if not BASE_URL:
    BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL", "") or "").rstrip("/")

ADMIN_EMAIL = "admin@mayur.com"
ADMIN_PASSWORD = "MayurAdmin@2024"

MAYUR_LOGO_URL = (
    "https://customer-assets.emergentagent.com/job_precision-abrasives/artifacts/"
    "48c20evv_WhatsApp%20Image%202026-05-23%20at%202.29.04%20PM.jpeg"
)


@pytest.fixture(scope="module")
def admin_client():
    s = requests.Session()
    r = s.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        timeout=15,
    )
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    body = r.json()
    if body.get("access_token"):
        s.headers.update({"Authorization": f"Bearer {body['access_token']}"})
    return s


@pytest.fixture(scope="module")
def original_state():
    """Capture original logo_url and slider_slides to restore after tests."""
    r = requests.get(f"{BASE_URL}/api/settings", timeout=15)
    assert r.status_code == 200
    data = r.json()
    return {
        "logo_url": data.get("logo_url", ""),
        "slider_slides": data.get("slider_slides", []),
    }


# ===================== logo_url feature =====================

def test_get_settings_includes_logo_url():
    """GET /api/settings should include a logo_url field."""
    r = requests.get(f"{BASE_URL}/api/settings", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "logo_url" in data, "logo_url field missing from GET /api/settings"
    assert isinstance(data["logo_url"], str)


def test_logo_url_backfilled_to_mayur_plus():
    """After startup backfill, logo_url should equal the Mayur Plus customer-assets URL."""
    r = requests.get(f"{BASE_URL}/api/settings", timeout=15)
    data = r.json()
    assert data.get("logo_url") == MAYUR_LOGO_URL, (
        f"expected Mayur Plus logo, got: {data.get('logo_url')!r}"
    )


def test_put_settings_requires_admin_for_logo():
    """PUT /api/settings without auth should reject logo_url update."""
    r = requests.put(
        f"{BASE_URL}/api/settings",
        json={"logo_url": "https://example.com/x.png"},
        timeout=15,
    )
    assert r.status_code in (401, 403), f"expected auth error, got {r.status_code}"


def test_put_logo_url_persists_new_value(admin_client, original_state):
    """Admin can PUT a new logo_url and it persists."""
    new_url = "https://example.com/test-logo.png"
    r = admin_client.put(f"{BASE_URL}/api/settings", json={"logo_url": new_url}, timeout=15)
    assert r.status_code == 200, f"PUT failed: {r.status_code} {r.text}"
    g = requests.get(f"{BASE_URL}/api/settings", timeout=15).json()
    assert g["logo_url"] == new_url, f"logo_url not persisted: {g['logo_url']!r}"
    # restore
    admin_client.put(
        f"{BASE_URL}/api/settings", json={"logo_url": original_state["logo_url"]}, timeout=15
    )


def test_put_logo_url_empty_string_resets(admin_client, original_state):
    """Sending logo_url='' should reset the field (clear the logo)."""
    # First set a known value
    admin_client.put(
        f"{BASE_URL}/api/settings", json={"logo_url": "https://example.com/foo.png"}, timeout=15
    )
    # Now clear it
    r = admin_client.put(f"{BASE_URL}/api/settings", json={"logo_url": ""}, timeout=15)
    # NOTE: server uses `v is not None` filter, so '' SHOULD pass through (empty string != None)
    assert r.status_code == 200, f"PUT failed: {r.status_code} {r.text}"
    g = requests.get(f"{BASE_URL}/api/settings", timeout=15).json()
    assert g["logo_url"] == "", f"empty string did not clear logo_url: {g['logo_url']!r}"
    # restore
    admin_client.put(
        f"{BASE_URL}/api/settings", json={"logo_url": original_state["logo_url"]}, timeout=15
    )


# ===================== empty slide filter regression =====================

def test_put_slider_slides_filters_empty_slides(admin_client, original_state):
    """Iter5 carry-over bug fix: PUT /api/settings must filter out fully-empty slides."""
    payload = {
        "slider_slides": [
            {"desktop": "A", "mobile": "B"},
            {"desktop": "", "mobile": ""},  # MUST be filtered out
        ]
    }
    r = admin_client.put(f"{BASE_URL}/api/settings", json=payload, timeout=15)
    assert r.status_code == 200, f"PUT failed: {r.status_code} {r.text}"
    g = requests.get(f"{BASE_URL}/api/settings", timeout=15).json()
    slides = g["slider_slides"]
    assert len(slides) == 1, f"expected 1 slide after empty filter, got {len(slides)}: {slides}"
    assert slides[0] == {"desktop": "A", "mobile": "B"}
    # restore
    admin_client.put(
        f"{BASE_URL}/api/settings",
        json={"slider_slides": original_state["slider_slides"] or []},
        timeout=15,
    )
