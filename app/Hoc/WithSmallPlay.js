import React from 'react';
import { View, Text } from 'react-native';
import SmallPlayerView from '../Components/SmallPlayerView';
import AppContext from '../Context/AppContext';


// Higher-Order Component
const WithSmallPlay = (WrappedComponent) => {
    return class extends React.Component {
        render() {
            // Render the wrapped component with the extra props
            return <AppContext.Consumer>
                {value => {
                    return (<WrappedComponent {...this.props} playDetail={value.playDetail} />)
                }}
            </AppContext.Consumer>
        }
    };
};

export default WithSmallPlay;
