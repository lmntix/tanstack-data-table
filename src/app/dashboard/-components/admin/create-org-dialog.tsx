"use client"
import { useRouter } from "@tanstack/react-router"
import { Loader2, PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth/auth-client"

export function CreateOrganizationDialog() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isSlugEdited, setIsSlugEdited] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)

  useEffect(() => {
    if (!isSlugEdited) {
      const generatedSlug = name.trim().toLowerCase().replace(/\s+/g, "-")
      setSlug(generatedSlug)
    }
  }, [name, isSlugEdited])

  useEffect(() => {
    if (open) {
      setName("")
      setSlug("")
      setIsSlugEdited(false)
      setLogo(null)
    }
  }, [open])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="w-full gap-2" size="sm" variant="default">
          <PlusIcon />
          <p>New Organization</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-11/12 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Organization</DialogTitle>
          <DialogDescription>Create a new organization to collaborate with your team.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Organization Name</Label>
            <Input onChange={(e) => setName(e.target.value)} placeholder="Name" value={name} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Organization Slug</Label>
            <Input
              onChange={(e) => {
                setSlug(e.target.value)
                setIsSlugEdited(true)
              }}
              placeholder="Slug"
              value={slug}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Logo</Label>
            <Input accept="image/*" onChange={handleLogoChange} type="file" />
            {logo && (
              <div className="mt-2">
                <img alt="Logo preview" className="h-16 w-16 object-cover" height={16} src={logo} width={16} />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              await authClient.organization.create(
                {
                  name,
                  slug,
                  logo: logo || undefined
                },
                {
                  onResponse: () => {
                    setLoading(false)
                  },
                  onSuccess: () => {
                    toast.success("Organization created successfully")
                    setOpen(false)
                    router.invalidate()
                  },
                  onError: (error: { error: { message: string } }) => {
                    toast.error(error.error.message)
                    setLoading(false)
                  }
                }
              )
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
