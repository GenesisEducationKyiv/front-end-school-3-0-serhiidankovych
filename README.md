# 🎵 Music Track Management App (Next.js) [[LinkedIn Profile](https://www.linkedin.com/in/serhii-dankovych-706642255/)]

A modern **Next.js** frontend for managing music tracks via a clean and interactive UI. This project supports full **CRUD operations**, **audio upload**, and **inline playback**, designed as a submission for the _Front-End School 3.0_ challenge. It emphasizes **feature based architecture**, **clean code**, and **testability** with `data-testid` attributes.


![Music Track Management App](https://github.com/user-attachments/assets/247351f9-93ff-4975-9d59-a5d5b07c1cd1)


## 🎵 Features

| ✨ Feature                      | ✅ Core Feature       | 🌟 Extra Feature       | 💬 Description |
|-------------------------------|-----------------------|------------------------|----------------|
| 🎼 Create Track (Without Audio) | <div align="center">✅</div> |                        | Modal for metadata input, optional cover image (with validation), metadata saved independently of audio |
| ✏️ Edit Track Metadata          | <div align="center">✅</div> |                        | Pre-filled edit modal, automatically updates the track list |
| 🎧 Upload Track Audio           | <div align="center">✅</div> |                        | Supports `.mp3` and `.wav`, validates type and size, replace/remove audio |
| ❌ Delete Track                 | <div align="center">✅</div> |                        | Removes from frontend/backend with confirmation dialog |
| 📜 Track List View              | <div align="center">✅</div> |                        | Paginated, sortable, debounced filtering, inline single-audio playback |
| 🔥 Bulk Delete                  |                        | <div align="center">✅</div> | Select and delete multiple tracks at once |
| ⚡ Optimistic UI Updates        |                        | <div align="center">✅</div> | Instant UI feedback before backend confirmation |
| 📈 Waveform Visualization       |                        | <div align="center">✅</div> | Shows waveform for currently playing track |

## 🖼️ Music Track Management App Gallery

This gallery showcases the **core functionality**, **interactive modals**, and overall **UX/UI** of the Music Track Management App. It includes examples of creating and editing tracks, uploading audio, using the audio player, applying filters, and managing the deletion process.

<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/b92eab65-0866-45cc-9c66-2374d9fb2883" alt="Screenshot 1" width="100%" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/c940e73c-5611-4347-9c1c-ba59321eb830" alt="Screenshot 2" width="100%" />
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <img src="https://github.com/user-attachments/assets/58ebdc2c-cee1-46c7-94e3-87f57f0078da" alt="Screenshot 3" width="100%" />
    </td>
  </tr>
</table>

## ⚡ Performance
  ![Performance](https://github.com/user-attachments/assets/cef34987-2d0c-4acf-ad3a-58df06852a4c)


  ## Final Review

<details>
  <summary>Click to Final Review</summary>

  **Comment: A good, clean, and well-structured project!**

  - Nice typing and validation using Zod. The folder structure is clear and helps quickly understand what is located where.
  - As an improvement, it would be good to split the `TracksPageContent` component into smaller ones. This kind of logic separation would greatly improve code readability and usability.
  - Very convenient reusable UI components (a small improvement: name component files with capital letters – it makes them easier to distinguish from regular functions).
  - It would also be great to add in the `README` file the commands to run tests and the linter.
  - Bonus points for using Next.js with the App Router. Nice use and optimization. You could also add a `loading.ts` page.
  - Since Next.js is often used for SEO, it's best practice to use semantic tags like `nav > ul > li` in the header and footer instead of just mapping links.
  - Great use of testing – various types included, which is definitely a plus. It would be good to add more test cases where each case checks only one thing (avoid too many `expect`s in one test).
  - The structure and interaction with the API are very good. A special mention for the proper use of GraphQL. Slight room for improvement: split API interaction methods into different files. It's a bit inconvenient when functions with different purposes (like `makeRequest`, `buildQueryParams`, and CRUD methods) are in the same file. Also, using suffixes in hook names (e.g., `useDeleteTracksMutation` instead of just `useDeleteTracks`) would make it easier to understand their purpose at a glance.

  ✅ The project is very readable and easy to understand. The architecture and structure are well thought out. Great use of libraries and tools.

  Keep up the great work!
</details>
