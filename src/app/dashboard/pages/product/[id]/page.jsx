import Upload from "@/app/lib/component/utilityCom/UploadProduct"

const Page = async({params})=>{
    const {id} =await params
    return (
        <div>
            This is the upload page
            <Upload id={id}/>
            

        </div>
    )
}

export default Page