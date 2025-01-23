'use client'

import { useSession } from "next-auth/react";

const HomePage = () => {
    // const {data: session} = useSession();
    
    // if (session) {
        window.location.href = '/dashboard';
    // } else {
    //     window.location.href = '/auth/login';
    // }
}

export default HomePage;