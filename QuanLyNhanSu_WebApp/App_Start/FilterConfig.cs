using QuanLyNhanSu_WebApp.Filter; 
using System.Web;
using System.Web.Mvc;

namespace QuanLyNhanSu_WebApp
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());

            // Lấy tham số để cấu hình menu
            filters.Add(new LayoutDataFilter());

            // Lấy tham số người dùng đăng nhập
            //filters.Add(new CustomAuthorizeAttribute());
        }
    }
}
