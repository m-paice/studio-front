import Dashboard from "@material-ui/icons/Dashboard";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Category from "@material-ui/icons/Category";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";

import DashboardPage from "./views/Dashboard/Dashboard.js";
import { Reports } from "./pages/Reports";
import { Services } from "./pages/Services";
import { Users } from "./pages/Users";
import { UsersForm } from "./pages/Users/Form";
import { ServicesForm } from "./pages/Services/Form";
import { Schedules } from "./pages/Schedules";
import { SchedulesForm } from "./pages/Schedules/Form";
import { Products } from "./pages/Products";
import { ProductsForm } from "./pages/Products/Form";
import { Categories } from "./pages/Categories";
import { CategoriesForm } from "./pages/Categories/Form";

export const subs = [
  { path: "/users/create", component: UsersForm, name: "Novo usuário" },
  { path: "/users/:id/edit", component: UsersForm, name: "Atualizar usuário" },
  {
    path: "/services/create",
    component: ServicesForm,
    name: "Atualizar serviço",
  },
  {
    path: "/services/:id/edit",
    component: ServicesForm,
    name: "Atualizar serviço",
  },
  {
    path: "/schedules/create",
    component: SchedulesForm,
    name: "Atualizar agendamento",
  },
  {
    path: "/schedules/:id/edit",
    component: SchedulesForm,
    name: "Atualizar agendamento",
  },
  {
    path: "/products/create",
    component: ProductsForm,
    name: "Atualizar produto",
  },
  {
    path: "/products/:id/edit",
    component: ProductsForm,
    name: "Atualizar produto",
  },
  {
    path: "/categories/create",
    component: CategoriesForm,
    name: "Atualizar produto",
  },
  {
    path: "/categories/:id/edit",
    component: CategoriesForm,
    name: "Atualizar produto",
  },
];

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/reports",
    name: "Relatórios",
    rtlName: "قائمة الجدول",
    icon: MonetizationOn,
    component: Reports,
    layout: "/admin",
  },
  {
    path: "/schedules",
    name: "Agendamentos",
    rtlName: "قائمة الجدول",
    icon: CalendarToday,
    component: Schedules,
    layout: "/admin",
  },
  {
    path: "/services",
    name: "Serviços",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: Services,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Usuários",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: Users,
    layout: "/admin",
  },
  {
    path: "/products",
    name: "Produtos",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: Products,
    layout: "/admin",
  },
  {
    path: "/categories",
    name: "Categorias",
    rtlName: "الرموز",
    icon: Category,
    component: Categories,
    layout: "/admin",
  },
];

export default dashboardRoutes;
