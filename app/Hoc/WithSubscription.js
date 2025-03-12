import React from 'react';
import { View, Text } from 'react-native';
import AppContext from '../Context/AppContext';


// Higher-Order Component
const WithSubscription = (WrappedComponent) => {
    return class extends React.Component {
        render() {
            // Render the wrapped component with the extra props
            return <AppContext.Consumer>
                {value => {
                    return (<WrappedComponent {...this.props} is_subscribe={value.is_subscribe} />)
                }}
            </AppContext.Consumer>
        }
    };
};

export default WithSubscription;
