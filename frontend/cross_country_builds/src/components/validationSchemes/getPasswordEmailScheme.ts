import { z } from "zod";

const getPassEmailScheme = z.object({
    newpassword: z.email("Az e-mail cím formátuma nem megfelelő!")
});

export default getPassEmailScheme;