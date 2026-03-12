import { localStates, indexEffect } from './localStates';
import { Test } from '../../Components/TestComponent';
import { ViewTransition } from "react";

export const Index = props => {
    const { styles, toggleShowModal, toggleModalMode, hhMessage, theme, showModal, modalMode } = localStates();
    indexEffect();

    return (
        <ViewTransition default="moveLeft">
            <div className={`${styles.indexPage} flex w-full flex-wrap justify-center`}>
                <h2 className={`text-center w-1/3 mt-3 font-bold text-3xl ${theme === 'black' ? 'text-white' : 'text-black'} reflejo`}
                >
                    Actual theme: {theme}
                </h2>
                <div className='flex w-full flex-wrap justify-center mt-4'>
                    <h3 className='w-full text-center'>
                        Options
                    </h3>
                    <div className='w-1/5 m-3'>
                        <button
                            className={`w-full rounded-lg px-4 py-2 ${showModal ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700' } text-white`}
                            onClick={toggleShowModal}
                        >
                            Show Modal
                        </button>
                    </div>
                    {showModal && 
                    <div className='w-1/5 m-3'>
                        <button
                            className='w-full rounded-lg px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white'
                            onClick={toggleModalMode}
                        >
                            Modal Mode: {modalMode === "M" ? "Move" : "Normal"}
                        </button>
                    </div>}
                </div>
                {showModal && 
                <b className='text-center w-full'>
                    Cambie el Theme de la pagina
                </b>}
                <p>
                    {hhMessage || 'Sin Message'}
                </p>
                <Test />
                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis, laudantium modi. Totam enim eligendi quos quis sunt explicabo ab nostrum quaerat vel quas ipsa cumque numquam qui deserunt, error perspiciatis quasi exercitationem culpa repudiandae blanditiis quod in maxime! Debitis necessitatibus quis inventore odio magni earum beatae. Quos voluptatem error cupiditate consequuntur laboriosam id, maiores, eveniet nisi ab pariatur fugit consectetur sapiente distinctio dolorum dignissimos nobis, corrupti reiciendis accusamus rem quae qui molestiae dolores. Asperiores maiores aperiam inventore dolor explicabo dolore aut culpa accusantium possimus blanditiis nihil facere omnis quis natus, voluptatibus, laudantium assumenda praesentium ullam numquam aspernatur in! Maiores vero doloribus impedit, architecto nihil porro minus asperiores, animi autem, ex tempora ipsa adipisci. Laudantium nesciunt dolorem aut quasi itaque. Ad illum quod, id impedit praesentium sit ducimus hic obcaecati placeat quisquam similique minima ea aliquid voluptate quaerat deserunt. Odio quos voluptates, libero ipsam nihil enim distinctio, eum est, suscipit accusantium mollitia deserunt molestiae qui nam recusandae. Eius eveniet dicta nisi natus debitis voluptatibus repellendus. Aut illum non laborum harum adipisci est ullam laudantium, eligendi quo in magni rem odit hic aspernatur repudiandae dolores autem! Dolorum provident non, voluptates corrupti nam, obcaecati quidem quibusdam ex sequi dicta tempora voluptatem magni repudiandae officiis. Cumque ex animi vero doloremque cupiditate explicabo eaque beatae, repudiandae dolore unde quas consequuntur, quos quaerat ratione dolorem ab quis quasi hic blanditiis soluta ipsa obcaecati aut! Unde totam cum distinctio culpa, iste nihil animi dolor nesciunt aperiam? Unde iusto sit totam soluta libero illum possimus nulla vel accusantium corporis! Quis quos facilis debitis dolorum consequatur eveniet possimus, necessitatibus iste, atque nulla sequi dolorem quasi! Alias minima aliquid voluptates facilis velit. Iusto minima perspiciatis quo harum aspernatur. Corrupti ad dolor ratione saepe eligendi quibusdam eaque amet ipsa odit accusamus dolorem blanditiis earum repudiandae recusandae esse voluptatibus quis laboriosam tempore, vero expedita dolore id. Magnam consequuntur quam vel provident illum sunt eaque itaque quod tempore quibusdam ipsam quisquam natus, neque molestias earum in nulla, ipsum optio soluta deleniti fugiat nostrum iusto pariatur! Voluptatem molestias tenetur saepe ipsa impedit maiores doloribus commodi iure? Non ea id incidunt sit odio quis dolor quasi perspiciatis, sapiente libero, illo quo voluptatum distinctio error sequi magni. Eaque aliquam doloremque velit quod voluptas iusto ea iste aperiam, sequi recusandae vel dolorum dolores tempore autem odio deserunt. Consequatur ea cupiditate ducimus? Qui at laudantium obcaecati tempore, animi quos voluptate. Eaque deleniti voluptate in nesciunt fugit pariatur molestias corrupti reprehenderit cumque dolorem a adipisci aliquid sequi impedit fugiat reiciendis quos, quis illum, quaerat quod libero. Minus vel commodi doloribus, molestias nisi quia sit magni quisquam optio. Nostrum consectetur corrupti excepturi. Cupiditate accusantium quae ab, vitae, est dolore earum impedit provident quisquam odit saepe reprehenderit esse voluptate? Reiciendis consequatur quis dolore, eaque sed ex expedita molestiae impedit ut blanditiis atque veritatis nulla, quod laboriosam! Libero quis itaque dolor culpa deserunt? Quod dolorem, non atque aut magni numquam nihil laborum necessitatibus eveniet facilis debitis suscipit asperiores quae at eos quaerat aliquid quia, corrupti repellat, tempora soluta dicta nemo eaque? Modi fugit doloremque similique voluptatum vel quia esse quo illum. Vel recusandae porro minima, aliquid vitae in, blanditiis expedita dolore perferendis reiciendis laborum. Voluptas hic minus accusamus praesentium eum dolor cum vitae laborum eveniet enim aliquid ipsum porro explicabo, sunt ut, nihil ducimus pariatur itaque nam at assumenda soluta facere odio veniam! Recusandae rerum cupiditate non saepe nam nemo id placeat! Fugiat, dolor? Eius magni tempore consectetur ipsam sapiente. Repudiandae consequuntur labore fugit aut incidunt odio accusamus est quis inventore. Excepturi, molestiae eum ipsum hic debitis nobis. Consequatur delectus vel ut non magni natus at reprehenderit. Tenetur deserunt asperiores, dicta voluptatem minus perferendis nam animi dolore, possimus maiores consequatur vel. Fugiat unde asperiores corporis vitae, quia iure, recusandae quasi exercitationem vero rem facere voluptatibus at hic ipsum non? Delectus ipsam nam possimus error fuga? Officiis a corrupti tenetur, qui nesciunt, totam ipsum dolorem, quam quibusdam fuga voluptate suscipit? Neque dolores ea odit nisi iste vitae laboriosam nam esse doloremque sapiente nesciunt, voluptatum cumque quis voluptates assumenda officiis! Quam non magni blanditiis, rerum ipsam similique dolor libero accusamus, a vitae voluptates atque debitis repellat autem voluptatem facere aliquid? Libero, voluptate. Quas porro nisi necessitatibus ea quod laborum itaque cumque atque. Rem, facere quaerat voluptatum officia perferendis nisi necessitatibus sapiente ex quasi tempore nesciunt veritatis quo. Cupiditate ratione porro velit! Et temporibus id tempore rerum, ducimus aut debitis accusamus voluptates sint in, perspiciatis ipsa fuga aperiam alias quis possimus tempora blanditiis quibusdam pariatur eos ea autem? Dicta atque facilis a cum, laborum necessitatibus recusandae iusto autem illo dolorum, accusamus neque temporibus. Molestiae possimus, totam unde eveniet, animi, veritatis facilis officiis obcaecati reiciendis quasi adipisci sequi excepturi in nobis? Quod, odio. Eum odio dignissimos, maiores repudiandae a, dolores deserunt, minus quia perferendis ratione necessitatibus dicta accusamus. Ut a possimus exercitationem. Cumque id, nulla enim incidunt illum assumenda voluptates doloremque aperiam sunt quis molestias reprehenderit magni amet maiores fuga molestiae saepe placeat laudantium modi. Ab voluptatem omnis mollitia, dolores assumenda non error hic accusamus, veniam debitis dicta dolore dolor explicabo, esse optio ducimus harum quis aspernatur saepe a et. Officia quibusdam quisquam modi mollitia repellat vero facere, molestias sit ipsum repellendus ex a ut. Animi, ut corporis. Temporibus porro impedit, inventore quo molestias sunt aspernatur autem enim eum! Ab culpa sequi quis incidunt ratione placeat dolores, eligendi cumque at, modi voluptate quam, ut nostrum quibusdam praesentium in! Nemo, vel? Exercitationem ipsum quas quis! Ea consequatur sint tempore blanditiis ipsam corrupti temporibus suscipit vel, unde repellat voluptate earum nulla inventore est fugit eius explicabo ipsa similique itaque atque omnis! Pariatur expedita vel ut deserunt voluptas ullam atque ratione. Vero soluta dolor illo dicta in deleniti, eum commodi porro temporibus quasi aspernatur, veritatis voluptates quam facere, cumque nisi! Voluptatibus neque ad dolore odio corporis dignissimos, illum possimus nobis nihil ratione minus ipsam ipsum ab animi deserunt, eveniet est officiis adipisci culpa, quasi laudantium! Maxime, cum. Saepe totam blanditiis corporis, rem aut doloribus vero doloremque. Aliquid assumenda dolore officia, quaerat voluptatibus maxime hic ratione, minima, similique delectus ullam.
                </p>
            </div>
        </ViewTransition>
    )
}

