import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

const FullPageLoadingSpinner = ({isLoading}) => {
    const loadingSpinner = (
        <div className="FullPageLoadingSpinner flex align-center justify-center">
            <div className="container">
                <LoadingSpinner/>
            </div>
        </div>
    );

    return isLoading && loadingSpinner;
};


FullPageLoadingSpinner.propTypes = {
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        isLoading: !!state.loading.blockUI
    };
};

export default connect(mapStateToProps)(FullPageLoadingSpinner);