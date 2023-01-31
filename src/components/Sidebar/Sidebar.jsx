/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
// core components
import AdminNavbarLinks from "../Navbars/AdminNavbarLinks";
import RTLNavbarLinks from "../Navbars/RTLNavbarLinks";

import styles from "../../assets/jss/material-dashboard-react/components/sidebarStyle";
import { useAuthContext } from "../../context/Auth";

const useStyles = makeStyles(styles);

export default function Sidebar(props) {
  const classes = useStyles();
  let location = useLocation();
  // verifies if routeName is the one active (in browser input)

  const { user } = useAuthContext();

  function activeRoute(routeName) {
    return location.pathname.includes(routeName);
  }
  const { color, logo, image, logoText, routes } = props;

  function handleFilterRoutes() {
    const superadmin = user.isSuperAdmin;

    if (superadmin) {
      return routes.filter((item) => item.permission === "superadmin");
    }

    if (user?.account?.type === "sales") {
      return routes.filter(
        (item) => item.permission === "sales" || item.permission === "all"
      );
    }

    if (user?.account?.type === "schedules") {
      return routes.filter(
        (item) => item.permission === "schedules" || item.permission === "all"
      );
    }

    return [];
  }

  var links = (
    <List className={classes.list}>
      {handleFilterRoutes().map((prop, key) => {
        var activePro = " ";
        var listItemClasses;
        if (prop.path === "/upgrade-to-pro") {
          activePro = classes.activePro + " ";
          listItemClasses = classNames({
            [" " + classes[color]]: true,
          });
        } else {
          listItemClasses = classNames({
            [" " + classes[color]]: activeRoute(prop.path),
          });
        }
        const whiteFontClasses = classNames({
          [" " + classes.whiteFont]: activeRoute(prop.path),
        });
        return (
          <NavLink
            to={prop.path}
            className={activePro + classes.item}
            activeClassName="active"
            key={key}
          >
            <ListItem
              button
              className={
                props.active
                  ? classes.itemLinkSm + listItemClasses
                  : classes.itemLink + listItemClasses
              }
            >
              {typeof prop.icon === "string" ? (
                <Icon
                  className={classNames(classes.itemIcon, whiteFontClasses)}
                >
                  {prop.icon}
                </Icon>
              ) : (
                <prop.icon
                  className={classNames(classes.itemIcon, whiteFontClasses)}
                />
              )}
              <ListItemText
                primary={props.active ? "" : prop.name}
                className={classNames(classes.itemText, whiteFontClasses)}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  var brand = (
    <div className={classes.logo}>
      <a
        href=""
        className={classNames(
          props.active ? classes.logoLinkSm : classes.logoLink
        )}
        target="_blank"
      >
        {"Studio Roane Rocha" || "Admin"}
      </a>
    </div>
  );

  return (
    <div>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={props.rtlActive ? "left" : "right"}
          open={props.open}
          classes={{
            paper: classNames(
              props.active ? classes.drawerPaperSm : classes.drawerPaper
            ),
          }}
          onClose={props.handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {brand}
          <div
            className={
              props.active ? classes.sidebarWrapperSm : classes.sidebarWrapper
            }
          >
            {props.rtlActive ? <RTLNavbarLinks /> : <AdminNavbarLinks />}
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          anchor={props.rtlActive ? "right" : "left"}
          variant="permanent"
          open
          classes={{
            paper: classNames(
              props.active ? classes.drawerPaperSm : classes.drawerPaper
            ),
          }}
        >
          {brand}
          <div
            className={
              props.active ? classes.sidebarWrapperSm : classes.sidebarWrapper
            }
          >
            {links}
          </div>
          {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        </Drawer>
      </Hidden>
    </div>
  );
}

Sidebar.propTypes = {
  rtlActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  logo: PropTypes.string,
  image: PropTypes.string,
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
};
