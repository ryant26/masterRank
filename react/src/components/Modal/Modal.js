import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

const FireTeamModal = (props) => {
    return (
        <Modal
            isOpen={props.modalOpen}
            onRequestClose={props.closeModal}
            ariaHideApp={false}
            className={{
                base: 'FireTeamModal',
                afterOpen: 'modal-open',
                beforeClose: 'modal-before-close'
            }}
            overlayClassName={{
                base: 'FireTeamModal-overlay',
                afterOpen: 'overlay-open',
                beforeClose: 'overlay-before-close'
            }}
        >
            <div className="FireTeamModal flex flex-column stretch">
                {props.children}
            </div>
        </Modal>
    );
};

FireTeamModal.propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    children: PropTypes.any
};

export default FireTeamModal;