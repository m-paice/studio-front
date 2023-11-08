import React from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
import ListIcon from "@material-ui/icons/List";
import MoreVert from "@material-ui/icons/MoreVert";
// core components
import CustomInput from "../CustomInput/CustomInput";
import Button from "../CustomButtons/Button";

import styles from "../../assets/jss/material-dashboard-react/components/headerLinksStyle";
import { useAuthContext } from "../../context/Auth";

import logo from "../../assets/img/logo.png";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks(props) {
  const { user, handleClear } = useAuthContext();

  const history = useHistory();

  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 25px 0px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Button
          color="white"
          aria-label="edit"
          justIcon
          round
          onClick={props.handleToggle}
        >
          {props.active ? <ListIcon /> : <MoreVert />}
        </Button>
        <img src={logo} width="80px" height="80px" />
        <h4> Bem-vindo ao seu Petrecho </h4>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <h4> {user.name} </h4>
        <div className={classes.manager}>
          <Button
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-owns={openProfile ? "profile-menu-list-grow" : null}
            aria-haspopup="true"
            onClick={handleClickProfile}
            className={classes.buttonLink}
          >
            <Person className={classes.icons} />
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile</p>
            </Hidden>
          </Button>
          <Poppers
            open={Boolean(openProfile)}
            anchorEl={openProfile}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !openProfile }) +
              " " +
              classes.popperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="profile-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleCloseProfile}>
                    <MenuList role="menu">
                      <MenuItem
                        onClick={() => history.push("/profile")}
                        className={classes.dropdownItem}
                      >
                        Perfil
                      </MenuItem>
                      {/* <MenuItem
                        onClick={handleCloseProfile}
                        className={classes.dropdownItem}
                      >
                        Configurações
                      </MenuItem> */}
                      <Divider light />
                      <MenuItem
                        onClick={() => {
                          history.push("/");
                          handleClear();
                        }}
                        className={classes.dropdownItem}
                      >
                        Sair
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>
      </div>
    </div>
  );
}
