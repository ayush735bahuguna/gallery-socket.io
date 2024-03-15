import DetailPage from "@/Components/DetailPage";
import { Suspense } from "react";

export default function Page() {
    return <Suspense fallback={<div>Loading...</div>}>
        <DetailPage />
    </Suspense>
}
