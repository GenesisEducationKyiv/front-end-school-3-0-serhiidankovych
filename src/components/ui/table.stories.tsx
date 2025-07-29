import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableFooter, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A responsive table component for music management applications, built with semantic HTML elements and Tailwind CSS styling.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;


const playlistTracks = [
  { 
    id: 1, 
    title: 'Bohemian Rhapsody', 
    artist: 'Queen', 
    album: 'A Night at the Opera', 
    duration: '5:55', 
    genre: 'Rock',
    plays: 1234567 
  },
  { 
    id: 2, 
    title: 'Stairway to Heaven', 
    artist: 'Led Zeppelin', 
    album: 'Led Zeppelin IV', 
    duration: '8:02', 
    genre: 'Rock',
    plays: 987654 
  },
  { 
    id: 3, 
    title: 'Hotel California', 
    artist: 'Eagles', 
    album: 'Hotel California', 
    duration: '6:30', 
    genre: 'Rock',
    plays: 876543 
  },
  { 
    id: 4, 
    title: 'Imagine', 
    artist: 'John Lennon', 
    album: 'Imagine', 
    duration: '3:03', 
    genre: 'Pop',
    plays: 765432 
  },
  { 
    id: 5, 
    title: 'Billie Jean', 
    artist: 'Michael Jackson', 
    album: 'Thriller', 
    duration: '4:54', 
    genre: 'Pop',
    plays: 654321 
  },
];

const albumData = [
  { 
    title: 'The Dark Side of the Moon', 
    artist: 'Pink Floyd', 
    year: 1973, 
    tracks: 10, 
    duration: '42:59',
    genre: 'Progressive Rock',
    rating: 5.0 
  },
  { 
    title: 'Abbey Road', 
    artist: 'The Beatles', 
    year: 1969, 
    tracks: 17, 
    duration: '47:23',
    genre: 'Rock',
    rating: 4.9 
  },
  { 
    title: 'Thriller', 
    artist: 'Michael Jackson', 
    year: 1982, 
    tracks: 9, 
    duration: '42:19',
    genre: 'Pop',
    rating: 4.8 
  },
  { 
    title: 'Back in Black', 
    artist: 'AC/DC', 
    year: 1980, 
    tracks: 10, 
    duration: '42:11',
    genre: 'Hard Rock',
    rating: 4.7 
  },
];

const artistData = [
  { 
    name: 'The Beatles', 
    genre: 'Rock', 
    albums: 13, 
    followers: 45000000, 
    monthlyListeners: 28000000,
    country: 'United Kingdom' 
  },
  { 
    name: 'Michael Jackson', 
    genre: 'Pop', 
    albums: 10, 
    followers: 32000000, 
    monthlyListeners: 22000000,
    country: 'United States' 
  },
  { 
    name: 'Queen', 
    genre: 'Rock', 
    albums: 15, 
    followers: 38000000, 
    monthlyListeners: 35000000,
    country: 'United Kingdom' 
  },
  { 
    name: 'Pink Floyd', 
    genre: 'Progressive Rock', 
    albums: 14, 
    followers: 25000000, 
    monthlyListeners: 18000000,
    country: 'United Kingdom' 
  },
];

const recentPlays = [
  { 
    timestamp: '2024-01-15 14:30', 
    track: 'Bohemian Rhapsody', 
    artist: 'Queen', 
    duration: '5:55',
    device: 'iPhone',
    location: 'New York' 
  },
  { 
    timestamp: '2024-01-15 14:24', 
    track: 'Come As You Are', 
    artist: 'Nirvana', 
    duration: '3:39',
    device: 'Desktop',
    location: 'Los Angeles' 
  },
  { 
    timestamp: '2024-01-15 14:18', 
    track: 'Sweet Child O\' Mine', 
    artist: 'Guns N\' Roses', 
    duration: '5:03',
    device: 'Android',
    location: 'Chicago' 
  },
];

export const MusicLibrary: Story = {
  render: () => (
    <Table>
      <TableCaption>Your music library - Recently played tracks</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Album</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead className="text-right">Plays</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playlistTracks.map((track, index) => (
          <TableRow key={track.id} className="hover:bg-gray-50">
            <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
            <TableCell className="font-medium">{track.title}</TableCell>
            <TableCell className="text-blue-600">{track.artist}</TableCell>
            <TableCell className="text-gray-600">{track.album}</TableCell>
            <TableCell className="font-mono text-sm">{track.duration}</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {track.genre}
              </span>
            </TableCell>
            <TableCell className="text-right">{track.plays.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const AlbumCollection: Story = {
  render: () => (
    <Table>
      <TableCaption>Your album collection</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Album</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Tracks</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead className="text-right">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {albumData.map((album, index) => (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell className="font-medium">{album.title}</TableCell>
            <TableCell className="text-blue-600">{album.artist}</TableCell>
            <TableCell>{album.year}</TableCell>
            <TableCell>{album.tracks}</TableCell>
            <TableCell className="font-mono text-sm">{album.duration}</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                {album.genre}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-medium">{album.rating}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const ArtistDirectory: Story = {
  render: () => (
    <Table>
      <TableCaption>Featured artists in your music library</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Artist</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead>Albums</TableHead>
          <TableHead>Followers</TableHead>
          <TableHead>Monthly Listeners</TableHead>
          <TableHead>Country</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {artistData.map((artist, index) => (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell className="font-medium">{artist.name}</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                {artist.genre}
              </span>
            </TableCell>
            <TableCell>{artist.albums}</TableCell>
            <TableCell>{(artist.followers / 1000000).toFixed(1)}M</TableCell>
            <TableCell>{(artist.monthlyListeners / 1000000).toFixed(1)}M</TableCell>
            <TableCell>{artist.country}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const PlaylistSummary: Story = {
  render: () => (
    <Table>
      <TableCaption>My Playlists Overview</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Playlist</TableHead>
          <TableHead>Tracks</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">🎸 Classic Rock Hits</TableCell>
          <TableCell>47</TableCell>
          <TableCell>3h 24m</TableCell>
          <TableCell>2024-01-10</TableCell>
          <TableCell>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Public
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">🎵 Chill Vibes</TableCell>
          <TableCell>23</TableCell>
          <TableCell>1h 52m</TableCell>
          <TableCell>2024-01-08</TableCell>
          <TableCell>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Private
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">🎤 Pop Favorites</TableCell>
          <TableCell>35</TableCell>
          <TableCell>2h 41m</TableCell>
          <TableCell>2024-01-05</TableCell>
          <TableCell>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Public
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">🎹 Jazz Classics</TableCell>
          <TableCell>18</TableCell>
          <TableCell>1h 15m</TableCell>
          <TableCell>2024-01-03</TableCell>
          <TableCell>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
              Collaborative
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-medium">Total</TableCell>
          <TableCell>123 tracks</TableCell>
          <TableCell>9h 12m</TableCell>
          <TableCell colSpan={2}>4 playlists</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const RecentActivity: Story = {
  render: () => (
    <Table>
      <TableCaption>Your recent listening activity</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Track</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Device</TableHead>
          <TableHead>Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentPlays.map((play, index) => (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell className="font-mono text-sm">{play.timestamp}</TableCell>
            <TableCell className="font-medium">{play.track}</TableCell>
            <TableCell className="text-blue-600">{play.artist}</TableCell>
            <TableCell className="font-mono text-sm">{play.duration}</TableCell>
            <TableCell>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {play.device}
              </span>
            </TableCell>
            <TableCell>{play.location}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const TopCharts: Story = {
  render: () => (
    <Table>
      <TableCaption>Top 10 Most Played Tracks This Week</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Rank</TableHead>
          <TableHead>Track</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Plays</TableHead>
          <TableHead>Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold text-yellow-600">1</TableCell>
          <TableCell className="font-medium">Flowers</TableCell>
          <TableCell className="text-blue-600">Miley Cyrus</TableCell>
          <TableCell>2,847,392</TableCell>
          <TableCell className="text-green-600">↑ 2</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold text-gray-400">2</TableCell>
          <TableCell className="font-medium">As It Was</TableCell>
          <TableCell className="text-blue-600">Harry Styles</TableCell>
          <TableCell>2,634,821</TableCell>
          <TableCell className="text-red-600">↓ 1</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold text-orange-600">3</TableCell>
          <TableCell className="font-medium">Anti-Hero</TableCell>
          <TableCell className="text-blue-600">Taylor Swift</TableCell>
          <TableCell>2,421,657</TableCell>
          <TableCell className="text-green-600">↑ 1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const MusicDashboard: Story = {
  render: () => (
    <Table className="border-purple-200">
      <TableCaption className="text-purple-800 font-semibold">
        🎵 Music Dashboard - Your listening stats
      </TableCaption>
      <TableHeader>
        <TableRow className="bg-purple-50">
          <TableHead className="text-purple-900">Metric</TableHead>
          <TableHead className="text-purple-900">This Week</TableHead>
          <TableHead className="text-purple-900">Last Week</TableHead>
          <TableHead className="text-purple-900">Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Total Listening Time</TableCell>
          <TableCell>12h 34m</TableCell>
          <TableCell>10h 45m</TableCell>
          <TableCell className="text-green-600">+1h 49m</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Tracks Played</TableCell>
          <TableCell>147</TableCell>
          <TableCell>132</TableCell>
          <TableCell className="text-green-600">+15</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">New Discoveries</TableCell>
          <TableCell>8</TableCell>
          <TableCell>5</TableCell>
          <TableCell className="text-green-600">+3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Favorite Genre</TableCell>
          <TableCell>Rock (45%)</TableCell>
          <TableCell>Pop (38%)</TableCell>
          <TableCell className="text-blue-600">Changed</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const EmptyPlaylist: Story = {
  render: () => (
    <Table>
      <TableCaption>Your playlist is empty</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="text-center text-gray-500 py-8">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-4xl">🎵</span>
              <span>No tracks in this playlist yet</span>
              <span className="text-sm">Add some music to get started!</span>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const CompactView: Story = {
  render: () => (
    <Table className="text-sm">
      <TableCaption>Compact playlist view</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Track</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Bohemian Rhapsody</TableCell>
          <TableCell>Queen</TableCell>
          <TableCell className="font-mono">5:55</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Stairway to Heaven</TableCell>
          <TableCell>Led Zeppelin</TableCell>
          <TableCell className="font-mono">8:02</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Hotel California</TableCell>
          <TableCell>Eagles</TableCell>
          <TableCell className="font-mono">6:30</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};