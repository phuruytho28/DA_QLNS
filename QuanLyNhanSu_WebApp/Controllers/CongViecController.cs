﻿using Microsoft.AspNet.Identity;
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

namespace QuanLyCongViec_WebApp.Controllers
{
    [CustomAuthorize]
    public class CongViecController : Controller
    {
        [CustomAuthorize]
        public ActionResult ListCongViecView()
        {
            return View();
        } 

        private readonly CongViecDAL CongViecDAL = new CongViecDAL();

        [HttpPost]
        public JsonResult FilterCongViec(CongViecModel CongViec)
        {
            int totalRows = 0;
            List<CongViecModel> CongViecList = new List<CongViecModel>();

            try
            {
                CongViecList = CongViecDAL.CongViec_Search(CongViec, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = CongViecList,
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
        public JsonResult save(CongViecModel obj)
        {
            var response = new JsonResponse();
            try
            {
                string newId = null;
                if (string.IsNullOrEmpty(obj.Id))
                {
                    obj.CreatedDate = DateTime.Now.ToString();
                    var result = CongViecDAL.CongViec_Insert(obj, ref newId);
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
                    CongViecDAL.CongViec_Update(obj);
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
        public JsonResult GetCongViecById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var CongViec = CongViecDAL.CongViec_GetById(id);
                if (CongViec != null)
                {
                    response.Success = true;
                    response.Data = CongViec;
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
        public JsonResult UpdateStatusId(CongViecModel CongViec)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(CongViec.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (CongViec.StatusId < 0 ||CongViec.TinhTrang < 0 ||CongViec.MucDo < 0)
                {
                    response.Success = false;
                    response.Message = "Tình trạng không hợp lệ.";
                    return Json(response);
                }

                CongViec.ModifyDate = DateTime.Now.ToString();

                CongViecDAL.CongViec_UpdateStatusId(CongViec);
                var trangthai = "";
                if (CongViec.StatusId > 0)
                { 
                    switch (CongViec.StatusId)
                    {
                        case 1:
                            trangthai = "khôi phục trạng thái hoạt động";
                            break;
                        case 2:
                            trangthai = "được chuyển vào thùng rác";
                            break;
                    }
                }
                if (CongViec.TinhTrang > 0)
                { 
                    switch (CongViec.TinhTrang)
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
                if (CongViec.MucDo > 0)
                { 
                    switch (CongViec.MucDo)
                    {
                        case 1:
                            trangthai = "chuyển sang mức độ ưu tiên thấp";
                            break;
                        case 2:
                            trangthai = "chuyển sang mức độ ưu tiên bình thường";
                            break;
                        case 3:
                            trangthai = "chuyển sang mức độ ưu tiên cao";
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
