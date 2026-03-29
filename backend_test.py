#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class MayurAbrasivesAPITester:
    def __init__(self, base_url="https://precision-abrasives.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            self.failed_tests.append({"name": name, "details": details})
            print(f"❌ {name} - {details}")

    def test_health_check(self):
        """Test health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}" if not success else ""
            self.log_test("Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Health Check", False, str(e))
            return False

    def test_admin_login(self):
        """Test admin login"""
        try:
            login_data = {
                "email": "admin@mayur.com",
                "password": "MayurAdmin@2024"
            }
            response = self.session.post(
                f"{self.base_url}/auth/login", 
                json=login_data,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.admin_token = data["access_token"]
                    self.session.headers.update({"Authorization": f"Bearer {self.admin_token}"})
                    self.log_test("Admin Login", True)
                    return True
                else:
                    self.log_test("Admin Login", False, "No access token in response")
                    return False
            else:
                self.log_test("Admin Login", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_get_products(self):
        """Test get products endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/products", timeout=10)
            success = response.status_code == 200
            details = ""
            if success:
                data = response.json()
                if isinstance(data, list):
                    details = f"Found {len(data)} products"
                else:
                    success = False
                    details = "Response is not a list"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Get Products", success, details)
            return success, response.json() if success else []
        except Exception as e:
            self.log_test("Get Products", False, str(e))
            return False, []

    def test_get_categories(self):
        """Test get categories endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/categories", timeout=10)
            success = response.status_code == 200
            details = ""
            if success:
                data = response.json()
                if isinstance(data, list):
                    details = f"Found {len(data)} categories"
                else:
                    success = False
                    details = "Response is not a list"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Get Categories", success, details)
            return success
        except Exception as e:
            self.log_test("Get Categories", False, str(e))
            return False

    def test_get_settings(self):
        """Test get settings endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/settings", timeout=10)
            success = response.status_code == 200
            details = ""
            if success:
                data = response.json()
                required_fields = ["whatsapp_number", "company_email", "company_phone", "company_address"]
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    success = False
                    details = f"Missing fields: {missing_fields}"
                else:
                    details = "All required settings present"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Get Settings", success, details)
            return success
        except Exception as e:
            self.log_test("Get Settings", False, str(e))
            return False

    def test_dealer_application(self):
        """Test dealer application submission"""
        try:
            dealer_data = {
                "name": "Test Dealer",
                "phone": "+919876543210",
                "email": "test@dealer.com",
                "city": "Mumbai",
                "state": "Maharashtra",
                "business_type": "Hardware Store",
                "business_name": "Test Hardware",
                "message": "Test application"
            }
            response = self.session.post(
                f"{self.base_url}/dealers/apply",
                json=dealer_data,
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}" if not success else "Application submitted"
            self.log_test("Dealer Application", success, details)
            return success
        except Exception as e:
            self.log_test("Dealer Application", False, str(e))
            return False

    def test_contact_inquiry(self):
        """Test contact inquiry submission"""
        try:
            inquiry_data = {
                "name": "Test User",
                "phone": "+919876543210",
                "email": "test@user.com",
                "company": "Test Company",
                "message": "Test inquiry message",
                "inquiry_type": "contact"
            }
            response = self.session.post(
                f"{self.base_url}/inquiries",
                json=inquiry_data,
                timeout=10
            )
            success = response.status_code == 200
            details = f"Status: {response.status_code}" if not success else "Inquiry submitted"
            self.log_test("Contact Inquiry", success, details)
            return success
        except Exception as e:
            self.log_test("Contact Inquiry", False, str(e))
            return False

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        if not self.admin_token:
            self.log_test("Admin Stats", False, "No admin token available")
            return False
        
        try:
            response = self.session.get(f"{self.base_url}/stats", timeout=10)
            success = response.status_code == 200
            details = ""
            if success:
                data = response.json()
                required_fields = ["products", "dealers", "pending_dealers", "inquiries", "new_inquiries"]
                missing_fields = [field for field in required_fields if field not in data]
                if missing_fields:
                    success = False
                    details = f"Missing fields: {missing_fields}"
                else:
                    details = f"Stats: {data}"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Admin Stats", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Stats", False, str(e))
            return False

    def test_admin_dealers_list(self):
        """Test admin dealers list endpoint"""
        if not self.admin_token:
            self.log_test("Admin Dealers List", False, "No admin token available")
            return False
        
        try:
            response = self.session.get(f"{self.base_url}/dealers", timeout=10)
            success = response.status_code == 200
            details = ""
            if success:
                data = response.json()
                if isinstance(data, list):
                    details = f"Found {len(data)} dealer applications"
                else:
                    success = False
                    details = "Response is not a list"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Admin Dealers List", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Dealers List", False, str(e))
            return False

    def test_admin_inquiries_list(self):
        """Test admin inquiries list endpoint"""
        if not self.admin_token:
            self.log_test("Admin Inquiries List", False, "No admin token available")
            return False
        
        try:
            response = self.session.get(f"{self.base_url}/inquiries", timeout=10)
            success = response.status_code == 200
            details = ""
            if success:
                data = response.json()
                if isinstance(data, list):
                    details = f"Found {len(data)} inquiries"
                else:
                    success = False
                    details = "Response is not a list"
            else:
                details = f"Status: {response.status_code}"
            
            self.log_test("Admin Inquiries List", success, details)
            return success
        except Exception as e:
            self.log_test("Admin Inquiries List", False, str(e))
            return False

    def test_product_crud(self):
        """Test product CRUD operations"""
        if not self.admin_token:
            self.log_test("Product CRUD", False, "No admin token available")
            return False
        
        try:
            # Create product
            product_data = {
                "name": "Test Product",
                "category": "cutting-wheels",
                "size": "4\"",
                "description": "Test product description",
                "use_cases": ["Testing"],
                "is_featured": False,
                "is_active": True
            }
            
            create_response = self.session.post(
                f"{self.base_url}/products",
                json=product_data,
                timeout=10
            )
            
            if create_response.status_code != 200:
                self.log_test("Product CRUD - Create", False, f"Create failed: {create_response.status_code}")
                return False
            
            created_product = create_response.json()
            product_id = created_product.get("id")
            
            if not product_id:
                self.log_test("Product CRUD - Create", False, "No product ID returned")
                return False
            
            # Get product
            get_response = self.session.get(f"{self.base_url}/products/{product_id}", timeout=10)
            if get_response.status_code != 200:
                self.log_test("Product CRUD - Get", False, f"Get failed: {get_response.status_code}")
                return False
            
            # Update product
            update_data = {"name": "Updated Test Product"}
            update_response = self.session.put(
                f"{self.base_url}/products/{product_id}",
                json=update_data,
                timeout=10
            )
            
            if update_response.status_code != 200:
                self.log_test("Product CRUD - Update", False, f"Update failed: {update_response.status_code}")
                return False
            
            # Delete product
            delete_response = self.session.delete(f"{self.base_url}/products/{product_id}", timeout=10)
            if delete_response.status_code != 200:
                self.log_test("Product CRUD - Delete", False, f"Delete failed: {delete_response.status_code}")
                return False
            
            self.log_test("Product CRUD Operations", True, "Create, Read, Update, Delete all successful")
            return True
            
        except Exception as e:
            self.log_test("Product CRUD", False, str(e))
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Mayur Abrasives API Tests")
        print("=" * 50)
        
        # Basic endpoints
        self.test_health_check()
        self.test_get_products()
        self.test_get_categories()
        self.test_get_settings()
        
        # Public form submissions
        self.test_dealer_application()
        self.test_contact_inquiry()
        
        # Admin authentication
        if self.test_admin_login():
            # Admin endpoints
            self.test_admin_stats()
            self.test_admin_dealers_list()
            self.test_admin_inquiries_list()
            self.test_product_crud()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = MayurAbrasivesAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())