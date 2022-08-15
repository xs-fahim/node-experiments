import { Card, Skeleton } from 'antd';

const Skeletons = ({ count = 3 }) => {
    return (
        <div className='getgenie-card-skeleton'>
            {[...Array(count)].map(item => <Card className="getgenie-generated-outlines-card">
                <Skeleton active />
            </Card>
            )}
        </div>


    )
}

export default Skeletons;