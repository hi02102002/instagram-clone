import Header from 'components/Header';
import React from 'react';

const Layout: React.FC = ({ children }) => {
   return (
      <>
         <Header />
         <div className=" mt-[calc(var(--header-height))] flex ">
            <div className="container-app">{children}</div>
         </div>
      </>
   );
};

export default Layout;
