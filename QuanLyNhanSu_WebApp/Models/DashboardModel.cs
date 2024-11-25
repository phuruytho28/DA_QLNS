using System;
using System.Collections.Generic;
using System.Linq;
using System.Web; 

namespace QuanLyNhanSu_WebApp.Models
{
    public class DashboardModel : CommonModel.CommonModel
    { 
        public string tbl_NhanSuId { get; set; }
        public string tbl_CompanyId { get; set; }
        public string tbl_CoSoId { get; set; }
        public string tbl_PhongBanId { get; set; }
        public string TenCongTy { get; set; }
        public string TenCoSo { get; set; }
        public string TenPhongBan { get; set; }


        public int TongSoCongTy { get; set; }
        public int TongSoCoSo { get; set; }
        public int TongSoPhongBan { get; set; }
        public int TongSoTaiKhoan_HD { get; set; }
        public int TongSoTaiKhoan_KHD { get; set; }

        // Nhân sự
        public int NS_0 { get; set; }
        public int NS_1 { get; set; }
        public int NS_2 { get; set; }
        public int NS_3 { get; set; }

        // Công việc
        public int CV_1 { get; set; }
        public int CV_2 { get; set; }
        public int CV_3 { get; set; }
        public int CV_4 { get; set; }

        // Khen thưởng, kỷ luật
        public int KhenThuong { get; set; }
        public int KyLuat { get; set; }

        // Lương tháng
        public long LT9 { get; set; }
        public long LT10 { get; set; }
        public long LT11 { get; set; }
        public long LT12 { get; set; }
    }
}
