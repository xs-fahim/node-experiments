import { Typography } from 'antd';

const GenieTitleMsg = ({ loading, title, list }) => {
    const { Text } = Typography
    return (
        <>
            {
                loading ?
                    <Text className='generateMsg'>
                        Generating {title} {" "}
                        <Text className="resultNumber">....</Text>
                    </Text>
                    : list.length > 0
                    &&
                    <Text className='generateMsg'>
                        {title === "title" || title === "intro" ? "Generated" : "Selected"}{" "}
                        {title} {"   "}
                        <span className="resultNumber">{list.length}</span>
                    </Text>
            }
        </>
    )
}

export default GenieTitleMsg