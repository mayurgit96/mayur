"""Tests for slider_slides (desktop + mobile per slide) on /api/settings."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/") or "http://localhost:8001"
# Read frontend env so we hit the same public URL the UI does
try:
    with open("/app/frontend/.env") as fh:
        for line in fh:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break
except Exception:
    pass

ADMIN_EMAIL = "admin@mayur.com"
ADMIN_PASSWORD = "MayurAdmin@2024"


@pytest.fixture(scope="module")
def admin_client():
    s = requests.Session()
    r = s.post(f"{BASE_URL}/api/auth/login",
               json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    body = r.json()
    if body.get("access_token"):
        s.headers.update({"Authorization": f"Bearer {body['access_token']}"})
    return s


@pytest.fixture(scope="module")
def original_slides():
    r = requests.get(f"{BASE_URL}/api/settings", timeout=15)
    assert r.status_code == 200
    return r.json().get("slider_slides", [])


def test_get_settings_returns_slider_slides_shape():
    r = requests.get(f"{BASE_URL}/api/settings", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert "slider_slides" in data, "slider_slides field missing"
    assert "slider_images" in data, "legacy slider_images field missing"
    slides = data["slider_slides"]
    assert isinstance(slides, list)
    assert len(slides) >= 5, f"expected >=5 seeded slides, got {len(slides)}"
    for s in slides:
        assert "desktop" in s and "mobile" in s, f"slide missing keys: {s}"
    # all 5 seeded slides should have desktop set
    desktop_filled = [s for s in slides[:5] if s.get("desktop")]
    assert len(desktop_filled) == 5, f"seeded desktop URLs missing: {slides[:5]}"
    # all 5 seeded slides should have mobile empty by default
    for s in slides[:5]:
        assert (s.get("mobile") or "") == "", f"expected empty mobile, got: {s}"


def test_legacy_slider_images_synced_with_desktop():
    r = requests.get(f"{BASE_URL}/api/settings", timeout=15)
    data = r.json()
    desktop_urls = [s["desktop"] for s in data["slider_slides"] if s.get("desktop")]
    # slider_images should equal/contain the desktop urls
    assert data["slider_images"] == desktop_urls, (
        f"slider_images not synced with desktop: {data['slider_images']} vs {desktop_urls}"
    )


def test_put_settings_requires_admin():
    r = requests.put(
        f"{BASE_URL}/api/settings",
        json={"slider_slides": [{"desktop": "A", "mobile": "B"}]},
        timeout=15,
    )
    assert r.status_code in (401, 403), f"expected auth error, got {r.status_code}"


def test_put_slider_slides_persists_and_syncs(admin_client, original_slides):
    payload = {
        "slider_slides": [
            {"desktop": "https://example.com/a-desk.jpg", "mobile": "https://example.com/a-mob.jpg"},
            {"desktop": "https://example.com/c-desk.jpg", "mobile": ""},
            {"desktop": "", "mobile": ""},  # empty slide should be filtered out
        ]
    }
    r = admin_client.put(f"{BASE_URL}/api/settings", json=payload, timeout=15)
    assert r.status_code == 200, f"PUT failed: {r.status_code} {r.text}"

    g = requests.get(f"{BASE_URL}/api/settings", timeout=15).json()
    slides = g["slider_slides"]
    # Empty slide should have been filtered
    assert len(slides) == 2, f"expected 2 slides after filter, got {len(slides)}: {slides}"
    assert slides[0] == {"desktop": "https://example.com/a-desk.jpg",
                         "mobile": "https://example.com/a-mob.jpg"}
    assert slides[1] == {"desktop": "https://example.com/c-desk.jpg", "mobile": ""}
    # slider_images auto-synced to desktop urls only
    assert g["slider_images"] == [
        "https://example.com/a-desk.jpg",
        "https://example.com/c-desk.jpg",
    ], f"slider_images not synced: {g['slider_images']}"

    # Restore original
    restore_payload = {"slider_slides": original_slides or []}
    rr = admin_client.put(f"{BASE_URL}/api/settings", json=restore_payload, timeout=15)
    assert rr.status_code == 200


def test_put_slider_slides_trims_whitespace(admin_client, original_slides):
    payload = {
        "slider_slides": [
            {"desktop": "  https://example.com/trim.jpg  ", "mobile": "  "},
        ]
    }
    r = admin_client.put(f"{BASE_URL}/api/settings", json=payload, timeout=15)
    assert r.status_code == 200
    g = requests.get(f"{BASE_URL}/api/settings", timeout=15).json()
    assert g["slider_slides"][0]["desktop"] == "https://example.com/trim.jpg"
    assert g["slider_slides"][0]["mobile"] == ""
    # restore
    admin_client.put(f"{BASE_URL}/api/settings",
                     json={"slider_slides": original_slides or []}, timeout=15)


def test_slider_interval_persists(admin_client, original_slides):
    r = admin_client.put(f"{BASE_URL}/api/settings", json={"slider_interval": 7}, timeout=15)
    assert r.status_code == 200
    g = requests.get(f"{BASE_URL}/api/settings", timeout=15).json()
    assert g["slider_interval"] == 7
    # restore default
    admin_client.put(f"{BASE_URL}/api/settings", json={"slider_interval": 3}, timeout=15)
