export let DoStartup = true;

export const Links = {
    website: "https://attacksec.pro/",
    github: "https://github.com/AttackSecurity",
    help: "https://github.com/AttackSecurity",
    disclaimer: "https://www.attacksec.pro/tos",
};


export const Changelog = {
    version: require("../../package.json").version,
    added: ["Init"],
    improved: ["Init"],
    fixed: ["Init"],
};

export const Pages = [
    {
        icon: "solar:home-2-bold-duotone",
        title: "Home",
        href: "/",
    },
    {
        icon: "solar:object-scan-bold-duotone",
        title: "Password Validator",
        href: "/passwordValidator",
    },
    {
        icon: "solar:password-minimalistic-input-bold-duotone",
        title: "Password Modifier",
        href: "/passwordModifier",
    },
    {
        icon: "solar:graph-bold-duotone",
        title: "Password Analysis",
        href: "/passwordAnalysis",
    },
    {
        icon: "solar:filter-bold-duotone",
        title: "Smart Filter",
        href: "/smartFilter",
    },
];