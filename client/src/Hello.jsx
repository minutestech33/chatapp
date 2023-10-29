import React, { useEffect, useRef } from 'react';

function Hello() {
  const containerRef = useRef();

  useEffect(() => {
    // When the component mounts, scroll to the bottom of the container
    if (containerRef.current) {
      containerRef.current.scrollTop = 12;
    }
  }, []);

  return (
    <div className="container" ref={containerRef}>
      <div className="content">
        {/* Your content here */}
        {/* For example, a list of items */}
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 3</li>
          <li>Item 3</li>
          <li>Item 3</li>
          <li>Item 3</li>
          <li>Item 3</li>
          {/* Add more items as needed */}
        </ul>
      </div>
    </div>
  );
}

export default Hello;
