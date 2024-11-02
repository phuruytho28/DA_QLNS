using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models
{
    public class TinhHuyenModel : CommonModel.CommonModel

    {
        public string Id { get; set; }
        public string MaHuyen { get; set; }
        public string MaTinh { get; set; }
        public string TenHuyen { get; set; }
        public string TenTinh { get; set; } 
    }
} 