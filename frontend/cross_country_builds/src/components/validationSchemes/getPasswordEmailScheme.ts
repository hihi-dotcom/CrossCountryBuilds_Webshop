import { z } from "zod";

const getPassEmailScheme = z.object({
    email: z.email("Az e-mail cím formátuma nem megfelelő!")
});

export default getPassEmailScheme;