import React from "react";

const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <thead>
      <tr className="lg:text-lg sm:text-base sm:gap-1">
        {children}
      </tr>
    </thead>
  );
};

export default TableHeader;


//si solo se pasa texto
// const TableHeader = ({ headers = [] }) => {
//   return (
//     <thead>
//       <tr className="lg:text-lg sm:text-base sm:gap-1">
//         {headers.map((headerText, index) => (
//           <th key={index} className="py-2">{headerText}</th>
//         ))}
//       </tr>
//     </thead>
//   );
// };

// export default TableHeader;
