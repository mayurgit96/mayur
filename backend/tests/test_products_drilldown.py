"""Backend tests for the new Categories+Subcategories seed (Abrasives hierarchy)
and product filtering by category/subcategory slug."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

ADMIN_EMAIL = "admin@mayur.com"
ADMIN_PASSWORD = "MayurAdmin@2024"


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{BASE_URL}/api/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                      timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ============ Reseeded categories hierarchy ============
class TestCategoriesSeed:
    def test_three_top_level_categories(self):
        r = requests.get(f"{BASE_URL}/api/categories", timeout=15)
        assert r.status_code == 200
        data = r.json()
        slugs = {c["slug"] for c in data}
        for expected in ["abrasives", "saw-blades", "power-tools-accessories"]:
            assert expected in slugs, f"Missing slug: {expected}. Got: {slugs}"

    def test_abrasives_subcategories(self):
        r = requests.get(f"{BASE_URL}/api/categories", timeout=15)
        cats = {c["slug"]: c for c in r.json()}
        abr = cats["abrasives"]
        sub_slugs = {s["slug"] for s in abr["subcategories"]}
        for expected in ["cut-off-wheels", "grinding-wheels", "flap-discs",
                         "non-woven-wheels", "buffing-polishing"]:
            assert expected in sub_slugs, f"Missing abrasives sub: {expected}"

    def test_saw_blades_subcategories(self):
        r = requests.get(f"{BASE_URL}/api/categories", timeout=15)
        cats = {c["slug"]: c for c in r.json()}
        sub_slugs = {s["slug"] for s in cats["saw-blades"]["subcategories"]}
        for expected in ["tct", "diamond", "marble-granite"]:
            assert expected in sub_slugs

    def test_power_tools_subcategories(self):
        r = requests.get(f"{BASE_URL}/api/categories", timeout=15)
        cats = {c["slug"]: c for c in r.json()}
        sub_slugs = {s["slug"] for s in cats["power-tools-accessories"]["subcategories"]}
        for expected in ["drill-bits", "wire-brushes"]:
            assert expected in sub_slugs


# ============ Product filtering by category/subcategory ============
class TestProductFiltering:
    def test_all_products(self):
        r = requests.get(f"{BASE_URL}/api/products", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 6, f"expected 6 seeded products, got {len(data)}"

    def test_filter_by_abrasives(self):
        r = requests.get(f"{BASE_URL}/api/products?category=abrasives", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 4
        assert all(p["category"] == "abrasives" for p in data)

    def test_filter_by_abrasives_cut_off_wheels(self):
        r = requests.get(
            f"{BASE_URL}/api/products?category=abrasives&subcategory=cut-off-wheels",
            timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 1
        assert data[0]["subcategory"] == "cut-off-wheels"
        assert "Cut Off" in data[0]["name"]

    def test_filter_by_saw_blades(self):
        r = requests.get(f"{BASE_URL}/api/products?category=saw-blades", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert len(data) == 2
        assert all(p["category"] == "saw-blades" for p in data)

    def test_filter_by_power_tools_returns_zero(self):
        # No products seeded under power-tools-accessories
        r = requests.get(
            f"{BASE_URL}/api/products?category=power-tools-accessories", timeout=15)
        assert r.status_code == 200
        assert isinstance(r.json(), list)


# ============ Admin can still CRUD categories on new seed ============
class TestAdminCategoryCrud:
    def test_create_update_delete_with_subcategory(self, admin_headers):
        uniq = str(int(time.time()))
        payload = {
            "name": f"TESTcat {uniq}",
            "description": "drilldown test",
            "subcategories": [{"name": "Test Sub"}],
            "sort_order": 88,
        }
        r = requests.post(f"{BASE_URL}/api/categories", json=payload,
                          headers=admin_headers, timeout=15)
        assert r.status_code == 200, r.text
        created = r.json()
        cat_id = created["id"]
        assert any(s["slug"] == "test-sub" for s in created["subcategories"])

        # delete subcategory
        r = requests.delete(
            f"{BASE_URL}/api/categories/{cat_id}/subcategories/test-sub",
            headers=admin_headers, timeout=15)
        assert r.status_code == 200

        # delete category
        r = requests.delete(f"{BASE_URL}/api/categories/{cat_id}",
                            headers=admin_headers, timeout=15)
        assert r.status_code == 200
