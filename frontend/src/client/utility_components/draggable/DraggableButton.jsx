import Button from "@mui/material/Button"
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const DraggableButton = () => {
      const { dark, modeChange } = useContext(AuthContext);
  return (
    <>
            <Button sx={{position: 'fixed',top: 20, right: 20, background: 'rgba(143, 136, 136, 0.64)', zIndex: 999999999}} onClick={modeChange}>
                {dark ? <DarkModeIcon sx={{color: 'black'}} /> : <LightModeIcon sx={{color: 'white'}}/>}
            </Button>
    </>
  )
}

export default DraggableButton