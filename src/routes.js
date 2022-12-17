import Dashboard from "@material-ui/icons/Dashboard";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Category from "@material-ui/icons/Category";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import Store from "@material-ui/icons/Store";
import BubbleChart from "@material-ui/icons/BubbleChart";
import AccountBalance from "@material-ui/icons/AccountBalance";

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
import { Login } from "./pages/Login";
import { Accounts } from "./pages/Accounts";
import { AccountsForm } from "./pages/Accounts/Form";
import { UsersAdmin } from "./pages/UsersAdmin";
import { UsersAdminForm } from "./pages/UsersAdmin/Form";
import { Sales } from "./pages/Sales";
import { SalesForm } from "./pages/Sales/Form";
import { SalesView } from "./pages/Sales/View";
import { Profile } from "./pages/Profile/index.js";
import { ReportForm } from "./pages/Reports/Form/index.js";

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

  {
    path: "/accounts/create",
    component: AccountsForm,
    name: "Atualizar conta",
  },
  {
    path: "/accounts/:id/edit",
    component: AccountsForm,
    name: "Atualizar conta",
  },
  {
    path: "/useradmin/create",
    component: UsersAdminForm,
    name: "Atualizar usuário",
  },
  {
    path: "/useradmin/:id/edit",
    component: UsersAdminForm,
    name: "Atualizar usuário",
  },

  {
    path: "/sales/create",
    component: SalesForm,
    name: "Atualizar vendas",
  },
  {
    path: "/sales/:id/edit",
    component: SalesForm,
    name: "Atualizar vendas",
  },
  {
    path: "/sales/:id/show",
    component: SalesView,
    name: "Visualizar venda",
  },
  {
    path: "/reports/create",
    component: ReportForm,
    name: "Nova saída",
  },
];

export const routeLogin = {
  path: "/",
  component: Login,
};

const dashboardRoutes = [
  {
    path: "/accounts",
    name: "Conta",
    rtlName: "لوحة القيادة",
    icon: AccountBalance,
    component: Accounts,
    layout: "/accounts",
    permission: "superadmin",
  },
  {
    path: "/useradmin",
    name: "Usuários",
    rtlName: "لوحة القيادة",
    icon: Person,
    component: UsersAdmin,
    layout: "/useradmin",
    permission: "superadmin",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/dashboard",
    permission: "all",
  },
  {
    path: "/reports",
    name: "Relatórios",
    rtlName: "قائمة الجدول",
    icon: MonetizationOn,
    component: Reports,
    layout: "/reports",
    permission: "all",
  },
  {
    path: "/schedules",
    name: "Agendamentos",
    rtlName: "قائمة الجدول",
    icon: CalendarToday,
    component: Schedules,
    layout: "/schedules",
    permission: "schedules",
  },
  {
    path: "/services",
    name: "Serviços",
    rtlName: "طباعة",
    icon: LibraryBooks,
    component: Services,
    layout: "/services",
    permission: "schedules",
  },
  {
    path: "/sales",
    name: "Vendas",
    rtlName: "طباعة",
    icon: Store,
    component: Sales,
    layout: "/sales",
    permission: "sales",
  },
  {
    path: "/users",
    name: "Usuários",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: Users,
    layout: "/users",
    permission: "all",
  },
  {
    path: "/products",
    name: "Produtos",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: Products,
    layout: "/products",
    permission: "all",
  },
  {
    path: "/categories",
    name: "Categorias",
    rtlName: "الرموز",
    icon: Category,
    component: Categories,
    layout: "/categories",
    permission: "all",
  },

  {
    path: "/profile",
    name: "Profile",
    rtlName: "الرموز",
    icon: Category,
    component: Profile,
    layout: "/profile",
    permission: "",
  },
];

export default dashboardRoutes;
