using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models
{
    public class CategoryModel : CommonModel.CommonModel
    {
        public string Id { get; set; }               
        public string Name { get; set; }             
        public string MoTa { get; set; }             
        public int TinhTrang { get; set; }           
        public string PhanLoaiDM { get; set; }       
        public int RoleId { get; set; }           
        public string tbl_CompanyId { get; set; }    
        public string tbl_CoSoId { get; set; }       
        public string tbl_PhongBanId { get; set; }   
        public string DanhMucChaId { get; set; }   
    }
}
