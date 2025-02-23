function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background: white;
        }
        * {
          box-sizing: border-box;
        }
        /* Remove default button styles */
        button {
          font-family: inherit;
          font-size: inherit;
          color: inherit;
        }
        /* Remove default input styles */
        input {
          font-family: inherit;
          font-size: inherit;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 