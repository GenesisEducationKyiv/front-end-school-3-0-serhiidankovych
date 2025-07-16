import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Pagination } from './pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A pagination component for navigating through multiple pages of content.',
      },
    },
  },
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: 'The currently active page number',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: 'The total number of pages available',
    },
    onPageChange: {
      action: 'page-changed',
      description: 'Callback function called when a page is selected',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;


const PaginationWrapper = ({ totalPages, initialPage = 1 }: { totalPages: number; initialPage?: number }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 text-center">
        Page {currentPage} of {totalPages}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};


export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};


export const Interactive: Story = {
  render: () => <PaginationWrapper totalPages={10} />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive pagination that updates when clicking page numbers or navigation buttons.',
      },
    },
  },
};

export const FewPages: Story = {
  render: () => <PaginationWrapper totalPages={5} />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination with few pages (5 or less) shows all page numbers without ellipsis.',
      },
    },
  },
};

export const ManyPages: Story = {
  render: () => <PaginationWrapper totalPages={50} initialPage={25} />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination with many pages uses ellipsis to condense the display.',
      },
    },
  },
};

export const TwoPages: Story = {
  render: () => <PaginationWrapper totalPages={2} />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination with only two pages.',
      },
    },
  },
};

export const SinglePage: Story = {
  args: {
    currentPage: 1,
    totalPages: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'When there is only one page, pagination component returns null and renders nothing.',
      },
    },
  },
};


export const NearBeginning: Story = {
  render: () => <PaginationWrapper totalPages={20} initialPage={3} />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination behavior when current page is near the beginning of many pages.',
      },
    },
  },
};

export const NearEnd: Story = {
  render: () => <PaginationWrapper totalPages={20} initialPage={18} />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination behavior when current page is near the end of many pages.',
      },
    },
  },
};


export const FirstPageDisabled: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Previous button is disabled when on the first page.',
      },
    },
  },
};

export const LastPageDisabled: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Next button is disabled when on the last page.',
      },
    },
  },
};


export const LargeDataset: Story = {
  render: () => <PaginationWrapper totalPages={1000} initialPage={500} />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination handling a very large dataset with 1000 pages.',
      },
    },
  },
};

export const WithContent: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 8;
    const itemsPerPage = 5;
    
    
    const allItems = Array.from({ length: totalPages * itemsPerPage }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: `This is the description for item ${i + 1}`,
    }));
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = allItems.slice(startIndex, startIndex + itemsPerPage);
    
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Items List</h3>
          <div className="space-y-2">
            {currentItems.map((item) => (
              <div key={item.id} className="p-2 bg-gray-50 rounded">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <div className="text-center text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, allItems.length)} of {allItems.length} items
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Pagination component used with actual content to demonstrate real-world usage.',
      },
    },
  },
};


export const SevenPages: Story = {
  render: () => <PaginationWrapper totalPages={7} initialPage={4} />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination with exactly 7 pages (the threshold for showing ellipsis).',
      },
    },
  },
};

export const EightPages: Story = {
  render: () => <PaginationWrapper totalPages={8} initialPage={4} />,
  parameters: {
    docs: {
      description: {
        story: 'Pagination with 8 pages (just above the threshold, should show ellipsis).',
      },
    },
  },
};