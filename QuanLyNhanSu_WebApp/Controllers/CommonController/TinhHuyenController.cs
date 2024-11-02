using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using QuanLyTinhHuyen_WebApp.DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Controllers
{
    public class TinhHuyenController : Controller
    {
        
        // GET: TinhHuyen
        private readonly TinhHuyenDAL TinhHuyenDAL = new TinhHuyenDAL();

        [HttpPost]
        public JsonResult GetTinhHuyenById(string loai, string id = null)
        {
            var response = new JsonResponse();
            try
            {
                object TinhHuyen = null;

                if (loai == "Tinh")
                {
                    TinhHuyen = TinhHuyenDAL.Tinh_GetById(id);
                }
                else
                {
                    TinhHuyen = TinhHuyenDAL.Huyen_GetById(loai);
                }

                if (TinhHuyen != null && ((List<TinhHuyenModel>)TinhHuyen).Count > 0)
                {
                    response.Success = true;
                    response.Data = TinhHuyen;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy dữ liệu nào.";
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
        public JsonResult GetHuyenById(string loai)
        {
            var response = new JsonResponse();
            try
            {
                var TinhHuyen = TinhHuyenDAL.Huyen_GetById(loai);
                if (TinhHuyen != null)
                {
                    response.Success = true;
                    response.Data = TinhHuyen;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy Huyện nào.";
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return Json(response);
        }
    }
}
