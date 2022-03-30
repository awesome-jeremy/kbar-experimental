import * as React from "react";
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarSearch,
  useMatches,
  KBarResults,
  ActionImpl,
  ActionId,
  createAction,
  KBarProvider,
  Action,
  useKBar,
} from "kbar";
import useContactActions from "../hooks/useContactActions";


const marketingActions: Action[] = [
  {
    id: "marketingSection",
    name: "Marketing",
    shortcut: ["m", "k"],
    section: "Marketing",
    keywords: "market marketing",
  },
  {
    id: "followUps",
    name: "Follow Ups",
    section: "Marketing",
    keywords: "follow ups",
    parent: "marketingSection",
    perform: () =>
      window.open(
        "https://vm.app.axcelerate.com/management/management2/MarketingTasks.cfm",
        "_blank"
      ),
  },
  {
    id: "opportunities",
    name: "Opportunities",
    section: "Marketing",
    keywords: "opportunities",
    parent: "marketingSection",
    perform: () =>
      window.open(
        "https://vm.app.axcelerate.com/management/management2/MarketingTasks.cfm?ShowForecast=1&ShowAll=1",
        "_blank"
      ),
  },
];

const coursesActions: Action[] = [
  {
    id: "courseSection",
    name: "Courses",
    shortcut: ["c"],
    section: "Courses",
    keywords: "course course",
  },
  // workshops sub section
  {
    id: "workshops",
    name: "Workshops",
    section: "Courses",
    keywords: "workshop workshops",
    parent: "courseSection",
  },
  {
    id: "addNewWorkshop",
    name: "Add New Workshop",
    section: "Workshops",
    keywords: "add new workshop",
    parent: "workshops",
    perform: () =>
      window.open(
        "https://vm.app.axcelerate.com/management/management2/Program_Setup_SelectProgram.cfm",
        "_blank"
      ),
  },
  {
    id: "searchWorkshops",
    name: "Search Workshops",
    section: "Workshops",
    keywords: "search workshops",
    parent: "workshops",
    perform: () =>
      window.open(
        "https://vm.app.axcelerate.com/management/management2/ProgramsSearch.cfm",
        "_blank"
      ),
  },

  // accredited training sub section
  {
    id: "accreditedTraining",
    name: "Accredited Training",
    section: "Courses",
    keywords: "accredited training",
    parent: "courseSection",
  },
  {
    id: "classes",
    name: "Classes",
    section: "accreditedTraining",
    keywords: "classes",
    parent: "accreditedTraining",
    perform: () =>
      window.open(
        "https://vm.app.axcelerate.com/management/management2/rto/classes.cfm",
        "_blank"
      ),
  },
];

const initialActions: Action[] = [...marketingActions, ...coursesActions];

// deal with actions that needs to be dynamically rendered, e.g. fetch contacts from API
function DynamicActions() {
  useContactActions();
  return null;
}

export default function CommandBar() {
  return (
    <KBarProvider actions={initialActions}>
      <DynamicActions />
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator style={animatorStyle}>
            <KBarSearch style={searchStyle} />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
    </KBarProvider>
  );
}

function RenderResults() {
  const { results, rootActionId } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={groupNameStyle}>{item}</div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId || ""}
          />
        )
      }
    />
  );
}

const ResultItem = React.forwardRef(
  (
    {
      action,
      active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        style={{
          padding: "12px 16px",
          background: active ? "rgba(0 0 0 / 0.05)" : "transparent",
          borderLeft: `2px solid ${active ? "rgb(28 28 29)" : "transparent"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            fontSize: 14,
          }}
        >
          {action.icon && action.icon}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span
                      style={{
                        opacity: 0.5,
                        marginRight: 8,
                      }}
                    >
                      {ancestor.name}
                    </span>
                    <span
                      style={{
                        marginRight: 8,
                      }}
                    >
                      &rsaquo;
                    </span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span style={{ fontSize: 12 }}>{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div
            aria-hidden
            style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}
          >
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                style={{
                  padding: "4px 6px",
                  background: "rgba(0 0 0 / .1)",
                  borderRadius: "4px",
                  fontSize: 14,
                }}
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

function HomeIcon() {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m19.681 10.406-7.09-6.179a.924.924 0 0 0-1.214.002l-7.06 6.179c-.642.561-.244 1.618.608 1.618.51 0 .924.414.924.924v5.395c0 .51.414.923.923.923h3.236V14.54c0-.289.234-.522.522-.522h2.94c.288 0 .522.233.522.522v4.728h3.073c.51 0 .924-.413.924-.923V12.95c0-.51.413-.924.923-.924h.163c.853 0 1.25-1.059.606-1.62Z"
        fill="rgb(28 28 29)"
      />
    </svg>
  );
}

const searchStyle = {
  padding: "12px 16px",
  fontSize: "16px",
  width: "100%",
  boxSizing: "border-box" as React.CSSProperties["boxSizing"],
  outline: "none",
  border: "none",
  background: "rgb(252 252 252)",
  color: "rgb(28 28 29)",
};

const animatorStyle = {
  maxWidth: "600px",
  width: "100%",
  background: "rgb(252 252 252)",
  color: "rgb(28 28 29)",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0px 6px 20px rgb(0 0 0 / 20%)",
};

const groupNameStyle = {
  padding: "8px 16px",
  fontSize: "10px",
  textTransform: "uppercase" as const,
  opacity: 0.5,
};


