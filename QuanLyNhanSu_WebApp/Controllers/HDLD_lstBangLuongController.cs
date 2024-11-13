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

namespace QuanLyHDLD_lstBangLuong_WebApp.Controllers
{
    [CustomAuthorize]
    public class HDLD_lstBangLuongController : Controller
    {
        [CustomAuthorize]
        public ActionResult ListHDLD_lstBangLuongView()
        {
            return View();
        } 

        private readonly HDLD_lstBangLuongDAL HDLD_lstBangLuongDAL = new HDLD_lstBangLuongDAL();

        [HttpPost]
        public JsonResult FilterHDLD_lstBangLuong(HDLD_lstBangLuongModel HDLD_lstBangLuong)
        {
            int totalRows = 0;
            List<HDLD_lstBangLuongModel> HDLD_lstBangLuongList = new List<HDLD_lstBangLuongModel>();

            try
            {
                HDLD_lstBangLuongList = HDLD_lstBangLuongDAL.HDLD_lstBangLuong_Search(HDLD_lstBangLuong, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = HDLD_lstBangLuongList,
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
        public JsonResult save(HDLD_lstBangLuongModel obj)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(obj.tbl_NhanSuId))
                {
                    response.Success = false;
                    response.Message = "Id nhân sự không hợp lệ!.";
                }
                else
                {
                    string newId = null;
                    var HDLD_lstBangLuong = HDLD_lstBangLuongDAL.HDLD_lstBangLuong_GetByNhanSuId(obj.tbl_NhanSuId);

                    if (HDLD_lstBangLuong == null)
                    {
                        obj.CreatedDate = DateTime.Now.ToString();
                        var result = HDLD_lstBangLuongDAL.HDLD_lstBangLuong_Insert(obj, ref newId);
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
                        HDLD_lstBangLuongDAL.HDLD_lstBangLuong_Update(obj);
                        response.Success = true;
                        response.Message = "Cập nhật thành công!";
                    }
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
        public JsonResult GetHDLD_lstBangLuongById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var HDLD_lstBangLuong = HDLD_lstBangLuongDAL.HDLD_lstBangLuong_GetById(id);
                if (HDLD_lstBangLuong != null)
                {
                    response.Success = true;
                    response.Data = HDLD_lstBangLuong;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy nhân sự với Id này.";
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
        public JsonResult UpdateStatusId(HDLD_lstBangLuongModel HDLD_lstBangLuong)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(HDLD_lstBangLuong.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (HDLD_lstBangLuong.StatusId < 0 ||HDLD_lstBangLuong.TinhTrang < 0)
                {
                    response.Success = false;
                    response.Message = "Tình trạng không hợp lệ.";
                    return Json(response);
                }

                HDLD_lstBangLuong.ModifyDate = DateTime.Now.ToString();

                HDLD_lstBangLuongDAL.HDLD_lstBangLuong_UpdateStatusId(HDLD_lstBangLuong);
                var trangthai = "";
                if (HDLD_lstBangLuong.StatusId > 0)
                { 
                    switch (HDLD_lstBangLuong.StatusId)
                    {
                        case 1:
                            trangthai = "khôi phục trạng thái hoạt động";
                            break;
                        case 2:
                            trangthai = "được chuyển vào thùng rác";
                            break;
                    }
                }
                if (HDLD_lstBangLuong.TinhTrang > 0)
                { 
                    switch (HDLD_lstBangLuong.TinhTrang)
                    {
                        case 1:
                            trangthai = "được lên kế hoạch";
                            break;
                        case 2:
                            trangthai = "trong quá trình thực hiện ";
                            break;
                        case 3:
                            trangthai = "bị hoãn lại ";
                            break;
                        case 4:
                            trangthai = "hoàn thành ";
                            break;
                    }
                } 

                response.Success = true;
                response.Message = "Công việc đã " + trangthai;
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
