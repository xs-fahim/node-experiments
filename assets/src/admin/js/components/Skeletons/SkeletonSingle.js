import { Skeleton } from 'antd';

const SkeletonSingle = ({ count = 2 }) => {
    return (
        [...Array(count)].map(item => <Skeleton.Button className='getgenie-single-skeleton' active={true} block={true} shape={'default'} />)
    )
}

export { SkeletonSingle }