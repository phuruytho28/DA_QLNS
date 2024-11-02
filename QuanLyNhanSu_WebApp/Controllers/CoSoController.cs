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
    public class CoSoController : Controller
    {
        [CustomAuthorize]
        // GET: CoSo
        public ActionResult CoSoView()
        {
            return View();
        }

        private readonly CoSoDAL coSoDAL = new CoSoDAL();

        [HttpPost]
        public JsonResult FilterCoSo(CoSoModel coso)
        {
            int totalRows = 0;  
            List<CoSoModel> coSoList = new List<CoSoModel>();

            try
            {
                coSoList = coSoDAL.CoSo_Search(coso, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = coSoList,
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
        public JsonResult save(CoSoModel obj)
        {
            var response = new JsonResponse();
            try
            {
                string newId = null;
                if (string.IsNullOrEmpty(obj.Id))
                {
                    obj.CreatedDate = DateTime.Now.ToString();
                    var result = CoSoDAL.CoSo_Insert(obj, ref newId);
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
                    CoSoDAL.CoSo_Update(obj);   
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
        public JsonResult GetCoSoById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var coSo = CoSoDAL.CoSo_GetById(id);
                if (coSo != null)
                {
                    response.Success = true;
                    response.Data = coSo;
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
        public JsonResult UpdateStatusId(CoSoModel coso)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(coso.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (coso.StatusId <= 0)
                {
                    response.Success = false;
                    response.Message = "StatusId không hợp lệ.";
                    return Json(response);
                }

                coso.ModifyDate = DateTime.Now.ToString(); 

                CoSoDAL.CoSo_UpdateStatusId(coso);
                var trangthai = ""; 
                switch (coso.StatusId) {
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
