import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SKELETON_ROWS = 5;

export const TrackListSkeleton = () => (
  <div className="rounded-md border" data-testid="loading-tracks">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px] pl-4">
            <Skeleton className="h-4 w-4" />
          </TableHead>
          <TableHead className="w-[60px]" />
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead className="hidden md:table-cell">Album</TableHead>
          <TableHead className="hidden sm:table-cell">Genres</TableHead>
          <TableHead className="text-right w-[80px] pr-4">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
          <TableRow key={`skeleton-${index}`}>
            <TableCell className="pl-4">
              <Skeleton className="h-4 w-4" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-10 w-10 rounded" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell className="text-right pr-4">
              <Skeleton className="h-8 w-8 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
