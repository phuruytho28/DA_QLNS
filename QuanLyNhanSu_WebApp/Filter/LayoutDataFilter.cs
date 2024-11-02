using QuanLyNhanSu_WebApp.DataAccessLayer;
using QuanLyNhanSu_WebApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp.Filter
{
    // Lấy tham số để cấu hình menu
    public class LayoutDataFilter : ActionFilterAttribute
    {
        private readonly RoleInNavbarDAL _roleInNavbarDAL;

        public LayoutDataFilter()
        {
            _roleInNavbarDAL = new RoleInNavbarDAL(); // Khởi tạo DAL
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // Lấy dữ liệu từ DAL
            List<RoleInNavbarModel> rolesInNavbar = _roleInNavbarDAL.GetAll();

            // Truyền dữ liệu vào ViewBag để layout có thể sử dụng
            filterContext.Controller.ViewBag.RolesInNavbar = rolesInNavbar;

            base.OnActionExecuting(filterContext);
        }
    }
}