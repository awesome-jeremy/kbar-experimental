import { useRegisterActions, useKBar, Action } from "kbar";
import { useEffect, useState } from "react";

const userData: User[] = [
  { contactID: 10433441, name: "Jeremy Cheng" },
  { contactID: 10700490, name: "Rob Bisson" },
  { contactID: 8374532, name: "Craig Macleod" },
  { contactID: 9171235, name: "Ari Luangamath" },
  { contactID: 10433343, name: "Yangfan Zhang" },
  { contactID: 12304053, name: "Lena Stockwell" },
  { contactID: 10700248, name: "Sam Mackay" },
  { contactID: 3367956, name: "Julian Tetsworth" },
  { contactID: 4746, name: "Jade Steffensen" },
  { contactID: 219103, name: "Marcel Scherzer" },
  { contactID: 4745, name: "Michael A Ryan" },
  { contactID: 445036, name: "Unawesome Scott O'Connell" },
  { contactID: 10882493, name: "Bryan Kassulke" },
  { contactID: 5051615, name: "George Hinchliff" },
  { contactID: 13602028, name: "Josh Cannons" },
  { contactID: 13446335, name: "Roland Winter" },
  { contactID: 13907115, name: "Sanket Khot" },
];

interface User {
  contactID: number;
  name: string;
}

export default function useContactActions() {
  const { search } = useKBar((state) => ({
    // get the search string the user enters
    search: state.searchQuery,
  }));

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (search.length > 0) {
      // mimic getting user data from api
      setTimeout(() => {
        const searchUsers = userData.filter((user) => {
          let reg = new RegExp(search, "gi");
          return user.name.match(reg);
        });
        setUsers(searchUsers);
      }, 1500); // wait for 1.5s to get data back
    }
  }, [search]);

  const dynamicContactActions: Action[] = users.map((user) => ({
    id: user.contactID.toString(),
    name: user.name,
    section: "Search Contact",
    parent: "contact",
    perform: () =>
      window.open(
        `https://vm.app.axcelerate.com/management/management2/Contact_View.cfm?ContactID=${user.contactID.toString()}`,
        "_blank"
      ),
  }));

  useRegisterActions(
    [
      {
        id: "contact",
        name: "Search contact...",
        keywords: "search contact",
        section: "Search Contact",
      },
      ...dynamicContactActions,
    ],
    [users]
  );
}
