using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Controllers
{
    public class CategoryController : Controller
    {
        [CustomAuthorize]
        // GET: Category
        public ActionResult CategoryView()
        {
            return View();
        }

        private readonly CategoryDAL CategoryDAL = new CategoryDAL();

        [HttpPost]
        public JsonResult FilterCategory(CategoryModel Category)
        {
            int totalRows = 0;  
            List<CategoryModel> CategoryList = new List<CategoryModel>();

            try
            {
                CategoryList = CategoryDAL.Category_Search(Category, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = CategoryList,
                    TotalRows = totalRows
                });
            }
            catch (Exception ex)
            {

                return Json(new
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi tìm kiếm dữ liệu.",
                    ErrorDetails = ex.Message  
                });
            }
        }
        [HttpPost]
        public JsonResult FilterPrivate_Category(CategoryModel Category)
        {
            int totalRows = 0;  
            List<CategoryModel> CategoryList = new List<CategoryModel>();

            try
            {
                CategoryList = CategoryDAL.Category_Search_Private(Category, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = CategoryList,
                    TotalRows = totalRows
                });
            }
            catch (Exception ex)
            {

                return Json(new
                {
                    Success = false,
                    Message = "Đã xảy ra lỗi khi tìm kiếm dữ liệu.",
                    ErrorDetails = ex.Message  
                });
            }
        }

        [HttpPost]
        public JsonResult save(CategoryModel obj)
        {
            var response = new JsonResponse();
            try
            {
                string newId = null;
                if (string.IsNullOrEmpty(obj.Id))
                {
                    obj.CreatedDate = DateTime.Now.ToString();
                    var result = CategoryDAL.Category_Insert(obj, ref newId);
                    if (!string.IsNullOrEmpty(newId))
                    {
                        response.Success = true;
                        response.Message = "Thêm mới thành công!";
                        response.NewId = newId;
                    }
                    else
                    {
                        response.Success = false;
                        response.Message = "Insert failed.";
                    }
                }
                else
                { 
                    obj.ModifyDate = DateTime.Now.ToString();
                    CategoryDAL.Category_Update(obj);   
                    response.Success = true;
                    response.Message = "Cập nhật thành công!";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
             
            return Json(response);
        }

        [HttpPost]
        public JsonResult GetCategoryById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var Category = CategoryDAL.Category_GetById(id);
                if (Category != null)
                {
                    response.Success = true;
                    response.Data = Category;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy cơ sở với Id này.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return Json(response);
        }

        [HttpPost]
        public JsonResult UpdateStatusId(CategoryModel Category)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(Category.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (Category.StatusId <= 0)
                {
                    response.Success = false;
                    response.Message = "StatusId không hợp lệ.";
                    return Json(response);
                }

                Category.ModifyDate = DateTime.Now.ToString(); 

                CategoryDAL.Category_UpdateStatusId(Category);
                var trangthai = ""; 
                switch (Category.StatusId) {
                    case 1:
                        trangthai = "khôi phục trạng thái hoạt động";
                            break;
                    case 2:
                        trangthai = "được chuyển vào thùng rác";
                            break; 
                }

                response.Success = true;
                response.Message = "Cơ sở đã " + trangthai;
            }
            catch (SqlException sqlEx)
            {
                response.Success = false;
                response.Message = $"Lỗi SQL: {sqlEx.Message}";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Đã xảy ra lỗi khi cập nhật trạng thái: {ex.Message}";
            }

            return Json(response);
        }

    }
}
