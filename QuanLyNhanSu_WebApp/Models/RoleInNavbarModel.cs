using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QuanLyNhanSu_WebApp.Models
{
    public class RoleInNavbarModel
    {
        public string Id { get; set; }
        public string FunctionName { get; set; }
        public string tblAcconut_RoleId { get; set; }
        public int BranchInNav { get; set; }
        public int PositionInNav { get; set; }
        public string PathInFolder { get; set; }
        public int StatusId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Note { get; set; }
        public string C1 { get; set; }
        public string C2 { get; set; }
        public string C3 { get; set; }
    }
}