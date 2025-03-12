import React from 'react';
import { View, Text } from 'react-native';
import SmallPlayerView from '../Components/SmallPlayerView';
import AppContext from '../Context/AppContext';


// Higher-Order Component
const WithHeadBar = (WrappedComponent) => {
    return class extends React.Component {
        render() {
            // Render the wrapped component with the extra props
            return <AppContext.Consumer>
                {value => {
                    console.log("🚀 ~ extends ~ render ~ value:", value)
                    
                    return (<WrappedComponent {...this.props} current_categories_id={value.current_categories_id} />)
                }}
            </AppContext.Consumer>
        }
    };
};

export default WithHeadBar;
