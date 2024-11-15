using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using Swashbuckle.Swagger;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyChamCong_WebApp.Controllers
{
    [CustomAuthorize]
    public class ChamCongController : Controller
    {
        [CustomAuthorize]
        public ActionResult DetailChamCongView()
        {
            return View();
        } 

        private readonly ChamCongDAL ChamCongDAL = new ChamCongDAL();

        [HttpPost]
        public JsonResult FilterChamCong(ChamCongModel ChamCong)
        {
            int totalRows = 0;
            List<ChamCongModel> ChamCongList = new List<ChamCongModel>();

            try
            {
                ChamCongList = ChamCongDAL.ChamCong_Search(ChamCong, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = ChamCongList,
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
        public JsonResult save(ChamCongModel obj)
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
                    if(HDLD_lstBangLuong != null)
                    {
                        if(HDLD_lstBangLuong.TinhTrang == 2)
                        {
                            var ChamCong = ChamCongDAL.ChamCong_GetByDate(obj.Ngay, obj.Thang, obj.Nam, obj.tbl_NhanSuId);

                            if (ChamCong == null)
                            {
                                obj.CreatedDate = DateTime.Now.ToString();
                                var result = ChamCongDAL.ChamCong_Insert(obj, ref newId);
                                if (!string.IsNullOrEmpty(newId))
                                {
                                    response.Success = true;
                                    response.Message = "Bạn đã chấm công vào cho hôm nay!";
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
                                ChamCongDAL.ChamCong_Update(obj);
                                response.Success = true;
                                response.Message = "Bạn đã hoàn thành chấm công cho hôm nay!!";
                            }
                        }
                        else
                        {
                            response.Success = false;
                            response.Message = "Hợp đồng lao động của nhân sự chưa được phê duyệt, không thể thực hiện chấm công!!!";
                        }
                    }
                    else
                    {
                        response.Success = false;
                        response.Message = "Chưa có thông tin về hợp đồng cho nhân sự nên không thể thực hiện chấm công!!!";
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
        public JsonResult GetChamCongByNhanSuId(string NhanSuId)
        {
            var response = new JsonResponse();
            try
            {
                var ChamCong = ChamCongDAL.ChamCong_GetByNhanSuId(NhanSuId);
                if (ChamCong != null)
                {
                    response.Success = true;
                    response.Data = ChamCong;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Chưa có thông tin về hợp đồng cho nhân sự nên không thể thực hiện chấm công!!!";
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
        public JsonResult ChamCong_GetByDate(int Ngay, int Thang, int Nam, string tbl_NhanSuId)
        {
            var response = new JsonResponse();
            try
            {
                var ChamCong = ChamCongDAL.ChamCong_GetByDate(Ngay, Thang, Nam, tbl_NhanSuId);
                if (ChamCong != null)
                {
                    response.Success = true;
                    response.Data = ChamCong;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Chưa có dữ liệu chấm công hôm nay!!!";
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
        public JsonResult GetChamCongById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var ChamCong = ChamCongDAL.ChamCong_GetById(id);
                if (ChamCong != null)
                {
                    response.Success = true;
                    response.Data = ChamCong;
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
        public JsonResult UpdateStatusId(ChamCongModel ChamCong)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(ChamCong.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (ChamCong.StatusId < 0 ||ChamCong.TinhTrang < 0)
                {
                    response.Success = false;
                    response.Message = "Tình trạng không hợp lệ.";
                    return Json(response);
                }

                ChamCong.ModifyDate = DateTime.Now.ToString();

                ChamCongDAL.ChamCong_UpdateStatusId(ChamCong);
                var trangthai = "";
                if (ChamCong.StatusId > 0)
                { 
                    switch (ChamCong.StatusId)
                    {
                        case 1:
                            trangthai = "khôi phục trạng thái hoạt động";
                            break;
                        case 2:
                            trangthai = "được chuyển vào thùng rác";
                            break;
                    }
                }
                if (ChamCong.TinhTrang > 0)
                { 
                    switch (ChamCong.TinhTrang)
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




        //Chấm công theo tháng: Là số tiền tổng kết
        [HttpPost]
        public JsonResult saveTheoThang(ChamCongModel obj)
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
                    var ChamCong = ChamCongDAL.ChamCongTheoThang_GetByDate(obj.Ngay, obj.Thang, obj.Nam, obj.tbl_NhanSuId);

                    if (ChamCong == null)
                    {
                        obj.CreatedDate = DateTime.Now.ToString();
                        var result = ChamCongDAL.ChamCongTheoThang_Insert(obj, ref newId);
                        if (!string.IsNullOrEmpty(newId))
                        {
                            response.Success = true;
                            response.Message = "Đã lưu/duyệt dữ liệu lương tháng " + obj.Thang + " cho nhân sự";
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
                        ChamCongDAL.ChamCongTheoThang_Update(obj);
                        response.Success = true;
                        response.Message = "Đã cập nhật/duyệt dữ liệu lương tháng" + obj.Thang + " cho nhân sự";
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
        public JsonResult ChamCongTheoThang_GetByDate(int Ngay, int Thang, int Nam, string tbl_NhanSuId)
        {
            var response = new JsonResponse();
            try
            {
                var ChamCong = ChamCongDAL.ChamCongTheoThang_GetByDate(Ngay, Thang, Nam, tbl_NhanSuId);
                if (ChamCong != null)
                {
                    response.Success = true;
                    response.Data = ChamCong;
                }
                else
                {
                    response.Success = false;
                    response.Message = "Bạn chưa chấm công hôm nay!!!";
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
        public JsonResult FilterChamCongTheoThang(ChamCongModel ChamCong)
        {
            int totalRows = 0;
            List<ChamCongModel> ChamCongList = new List<ChamCongModel>();

            try
            {
                ChamCongList = ChamCongDAL.ChamCongTheoThang_Search(ChamCong, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = ChamCongList,
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
    }
}
