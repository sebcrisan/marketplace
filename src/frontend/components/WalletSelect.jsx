import React from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import metamaskImg from "../../assets/mm.png";
import walletconnectImg from "../../assets/wc.png";

import "./WalletSelect.css";

export const WalletSelect = (props) => {

  const handleClose = () => {
    props.setOpen(false);
  }

  return (
    <Modal
        open={props.open}
        onClose={handleClose}
    >
        <Box className="walletSelect">
            <Button 
                className="walletImgBtn"
                variant="contained"
                size="large"
                onClick={() => {
                    activate(connectors.walletConnect);
                    setProvider("walletConnect");
                    handleClose();
                }}
            >
                <img src={walletconnectImg} alt="walletconnect" className='walletImg'></img>
                WalletConnect
            </Button>
        <Button 
            className="walletImgBtn"
            variant="contained"
            size="large"
            onClick={() => {
                activate(connectors.injected);
                setProvider("injected");
                handleClose();
            }}
        ><img src={metamaskImg} alt="metamask" className='walletImg'></img>Metamask</Button>
        </Box>
    </Modal>
  )
}
