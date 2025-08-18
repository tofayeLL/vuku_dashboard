import { Star } from "lucide-react"
import Image from "next/image"
import bookImage from "@/assets/BookImage.png"

interface Book {
  id: string
  title: string
  coverImage: string
  rating: number
}

const books: Book[] = [
  {
    id: "1",
    title: "The Call of the Wild",
    coverImage: "/placeholder.svg?height=80&width=60",
    rating: 4.9,
  },
  {
    id: "2",
    title: "Treasure Island",
    coverImage: "/placeholder.svg?height=80&width=60",
    rating: 4.9,
  },
  {
    id: "3",
    title: "The Secret Garden",
    coverImage: "/placeholder.svg?height=80&width=60",
    rating: 4.9,
  },
]

export function BookList() {
  return (
    <div className="w-full bg-white p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">Book List</h1>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">View All</button>
      </div>

      {/* Book Items */}
      <div className="space-y-2">
        {books.map((book, index) => (
          <div key={book.id}>
            <div className="flex items-center gap-4 py-3">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <Image
                  src={bookImage}
                  alt="image"
                  className="w-15 h-20 object-cover rounded-md shadow-sm"
                />
              </div>

              {/* Book Title */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-foreground truncate">{book.title}</h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">{book.rating}</span>
              </div>
            </div>

            {/* Divider - hide after last item */}
            {index < books.length - 1 && <div className="border-b border-border" />}
          </div>
        ))}
      </div>
    </div>
  )
}
