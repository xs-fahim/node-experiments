import { GenieProps } from "./props";
const { compose } = wp.compose;

const GenieMapProps = (Component, action_list = []) => {
    if(!action_list.length)  { return Component; }
    let combineAction = [];
    action_list.forEach(key => {
        let ac = GenieProps[key];
        if(ac) {
            combineAction.push(ac)
        }
    })

    return (
        compose( combineAction )( Component )
    )
}

export { GenieMapProps }