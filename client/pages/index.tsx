import type { NextPage } from "next";
import * as React from "react";
import { AuthProvider } from "../src/store/Auth.provider";
// NextJS
import dynamic from "next/dynamic";
// Components
// import Loading from "../../components/Loading";

// const App = dynamic(() => import("../../components/App"), {
//   ssr: false,
//   // loading: () => <Loading />,
// });

const Home: NextPage = () => {
	// return <App />;
	return (
		<AuthProvider>
			<div>Chat</div>
		</AuthProvider>
	);
};

export default Home;
