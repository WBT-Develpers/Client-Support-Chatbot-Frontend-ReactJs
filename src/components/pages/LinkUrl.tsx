import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"

const LinkUrl = ({ link, setLink, handleSubmit, linkLoader }: any) => {
    return (
        <Card className="bg-white text-gray-300 pt-5">
            <CardContent className="">
                <p className="text-base text-black font-medium">
                    Add any youtube , blog or other link to train model.
                </p>
                <Input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full mt-3 text-black"
                />

                <Button onClick={handleSubmit} disabled={!link || linkLoader} className="bg-blue-600 hover:bg-blue-500 text-white mt-6">
                    {linkLoader ? "Training..." : " Train Link"}
                </Button>
            </CardContent>
        </Card>
    )
}

export default LinkUrl