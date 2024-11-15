using Microsoft.AspNet.Identity;
using QuanLyNhanSu_WebApp.Controllers.CommonController;
using QuanLyNhanSu_WebApp.DataAccessLayer;
using QuanLyNhanSu_WebApp.Filter;
using QuanLyNhanSu_WebApp.Models;
using QuanLyTuyenDung_WebApp.DataAccessLayer;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Controllers
{
    [CustomAuthorize]
    public class NhanSuController : Controller
    {
        // GET: NhanSu
        public ActionResult ListNhanSuView()
        {
            return View();
        }
        public ActionResult DetailNhanSuView()
        {
            return View();
        }

        private readonly NhanSuDAL NhanSuDAL = new NhanSuDAL();

        [HttpPost]
        public JsonResult FilterNhanSu(NhanSuModel NhanSu)
        {
            int totalRows = 0;  
            List<NhanSuModel> NhanSuList = new List<NhanSuModel>();

            try
            {
                NhanSuList = NhanSuDAL.NhanSu_Search(NhanSu, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = NhanSuList,
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
        public JsonResult save(NhanSuModel obj)
        {
            var response = new JsonResponse();
            try
            {
                string newId = null;
                if (string.IsNullOrEmpty(obj.Id))
                {
                    obj.CreatedDate = DateTime.Now.ToString();
                    var result = NhanSuDAL.NhanSu_Insert(obj, ref newId);
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
                    NhanSuDAL.NhanSu_Update(obj);   
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
        public JsonResult GetNhanSuById(string id)
        {
            var response = new JsonResponse();
            try
            {
                var NhanSu = NhanSuDAL.NhanSu_GetById(id);
                if (NhanSu != null)
                {
                    response.Success = true;
                    response.Data = NhanSu;
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
        public JsonResult UpdateStatusId(NhanSuModel NhanSu)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(NhanSu.C1))
                {
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (NhanSu.StatusId <= 0)
                {
                    response.Success = false;
                    response.Message = "StatusId không hợp lệ.";
                    return Json(response);
                }

                NhanSu.ModifyDate = DateTime.Now.ToString(); 

                NhanSuDAL.NhanSu_UpdateStatusId(NhanSu);
                var trangthai = ""; 
                switch (NhanSu.StatusId) {
                    case 1:
                        trangthai = "khôi phục trạng thái hoạt động";
                            break;
                    case 2:
                        trangthai = "được chuyển vào thùng rác";
                            break; 
                }

                response.Success = true;
                response.Message = "Nhân sự đã " + trangthai;
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

        [HttpPost]
        public JsonResult UpdateTinhTrangNS(NhanSuModel NhanSu)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(NhanSu.C1))
                { 
                    response.Success = false;
                    response.Message = "Danh sách Id không được để trống.";
                    return Json(response);
                }

                if (NhanSu.TinhTrang <= 0)
                {
                    response.Success = false;
                    response.Message = "Tình trạng không hợp lệ.";
                    return Json(response);
                }

                // Tách chuỗi C1 thành mảng các ID
                string[] ids = NhanSu.C1.Split(',');

                // Kiểm tra từng ID
                foreach (string id in ids)
                {
                    string trimmedId = id.Trim();
                    if (string.IsNullOrEmpty(trimmedId))
                    {
                        response.Success = false;
                        response.Message = "Danh sách chứa Id trống hoặc không hợp lệ.";
                        return Json(response);
                    }

                    var HDLD_lstBangLuong = HDLD_lstBangLuongDAL.HDLD_lstBangLuong_GetByNhanSuId(trimmedId);
                    if (HDLD_lstBangLuong == null)
                    {
                        response.Success = false;
                        response.Message = $"Vui lòng kiểm tra lại, đảm bảo rằng hồ sơ của tất cả nhân sự đã tạo hợp đồng lao động!";
                        //{ trimmedId}
                        return Json(response);
                    }
                }





                NhanSu.ModifyDate = DateTime.Now.ToString();
                

                NhanSuDAL.UpdateTinhTrangNS(NhanSu);
                var trangthai = ""; 
                switch (NhanSu.TinhTrang) {
                    case 2:
                        trangthai = "được duyệt (đang hoạt động)";
                            break;
                    case 3:
                        trangthai = "bị từ chối (nghỉ việc)";
                            break; 
                }

                response.Success = true;
                response.Message = "Tình trạng nhân sự đã " + trangthai;
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

        [HttpPost]
        public JsonResult DeleteNhanSu(string id)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(id))
                {
                    response.Success = false;
                    response.Message = "Id không được để trống.";
                    return Json(response);
                }

                NhanSuDAL.NhanSu_DeleteById(id);

                response.Success = true;
                response.Message = "Xóa nhân sự thành công!";
            }
            catch (SqlException sqlEx)
            {
                response.Success = false;
                response.Message = $"Lỗi SQL: {sqlEx.Message}";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Đã xảy ra lỗi khi xóa nhân sự: {ex.Message}";
            }

            return Json(response);
        }


        [HttpPost]
        public JsonResult LichSuXetDuyet_Search(NhanSu_LichSuDuyetModel LichSu)
        {
            int totalRows = 0;
            List<NhanSu_LichSuDuyetModel> LichSuList = new List<NhanSu_LichSuDuyetModel>();

            try
            {
                LichSuList = NhanSuDAL.LichSuXetDuyet_Search(LichSu, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = LichSuList,
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
        public JsonResult LichSuThayDoi_Search(NhanSu_LichSuThayDoiModel LichSu)
        {
            int totalRows = 0;
            List<NhanSu_LichSuThayDoiModel> LichSuList = new List<NhanSu_LichSuThayDoiModel>();

            try
            {
                LichSuList = NhanSuDAL.LichSuThayDoi_Search(LichSu, out totalRows);

                return Json(new
                {
                    Success = true,
                    Data = LichSuList,
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


        public JsonResult LichSu_ThayDoi_Insert(string tbl_NhanSuId, string HoTenNguoiThayDoi, string tbl_Category_ChucVuId,
                                                string tbl_Category_ChucVuNguoiThayDoiId, string tbl_PhongBanId, string tbl_CoSoId,
                                                string Note, string ModifyDate, string C3, int RoleId, int checkTD)
        {
            var response = new JsonResponse();
            try
            {
                if (string.IsNullOrEmpty(tbl_NhanSuId))
                {
                    response.Success = false;
                    response.Message = "Id nhân sự không hợp lệ.";
                    return Json(response);
                }

                if (string.IsNullOrEmpty(tbl_Category_ChucVuId) || string.IsNullOrEmpty(tbl_PhongBanId) || string.IsNullOrEmpty(tbl_CoSoId))
                {
                    response.Success = false;
                    response.Message = "Id thay đổi không hợp lệ.";
                    return Json(response);
                }

                ModifyDate = DateTime.Now.ToString();

                NhanSuDAL.LichSu_ThayDoi_Insert(tbl_NhanSuId, HoTenNguoiThayDoi, tbl_Category_ChucVuId,
                                                    tbl_Category_ChucVuNguoiThayDoiId, tbl_PhongBanId, tbl_CoSoId,
                                                    Note, ModifyDate, C3, RoleId, checkTD);
                //var trangthai = "";
                //switch (checkTD)
                //{
                //    case 1:
                //        trangthai = "được thăng chức";
                //        break;
                //    case 2:
                //        trangthai = "được điều chuyển phòng ban";
                //        break;
                //    case 3:
                //        trangthai = "được điều chuyển cơ sở";
                //        break; 
                //}

                response.Success = true;
                response.Message = "Nhân sự đã được cập nhật " ;
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
