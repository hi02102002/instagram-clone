import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonPost = () => {
   return (
      <div className="w-full">
         <div className="h-header-height flex items-center  px-5 bg-white rounded-t border border-solid border-border-color gap-x-4">
            <Skeleton circle width={36} height={36} />
            <Skeleton width={80} height={20} />
         </div>
         <div className="aspect-square">
            <Skeleton width={'100%'} height="100%" className="rounded-none" />
         </div>
         <div className="w-full h-28 bg-white flex py-4 px-5 flex-col gap-y-3">
            <Skeleton />
            <Skeleton />
            <Skeleton />
         </div>
      </div>
   );
};

export default SkeletonPost;
